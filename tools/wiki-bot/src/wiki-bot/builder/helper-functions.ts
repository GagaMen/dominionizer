import { WikiText } from '../wiki-client/api-models';

export interface TemplateArguments {
    positional: WikiText[];
    named: Map<string, WikiText>;
}

export function extractTemplates(wikiText: WikiText, templateName: string): WikiText[] {
    const templates: WikiText[] = [];
    // the word boundary keeps '{{CardLangVersion' from matching '{{CardLangVersionImage'
    const templateStartRegExp = new RegExp(`\\{\\{${templateName}\\b`, 'gs');
    const boundaryTokensRegExp = /\{\{|\}\}/gs;
    let templateStart: RegExpExecArray | null;

    while ((templateStart = templateStartRegExp.exec(wikiText))) {
        boundaryTokensRegExp.lastIndex = templateStart.index;

        let match: RegExpExecArray | null;
        let nestingDepth = 0;
        while ((match = boundaryTokensRegExp.exec(wikiText))) {
            nestingDepth += match[0] === '{{' ? 1 : -1;
            if (nestingDepth !== 0) {
                continue;
            }

            const templateEnd = match.index + '}}'.length;
            templates.push(wikiText.substring(templateStart.index, templateEnd));
            templateStartRegExp.lastIndex = templateEnd;
            break;
        }

        // the template is never closed, so there is nothing left to extract
        if (nestingDepth !== 0) {
            break;
        }
    }

    return templates;
}

export function extractTemplate(wikiText: WikiText, templateName: string): WikiText {
    return extractTemplates(wikiText, templateName)[0] ?? '';
}

export function extractTemplateArguments(template: WikiText): TemplateArguments {
    const templateBody = template.replace(/^\s*\{\{/, '').replace(/\}\}\s*$/, '');
    // the first part is the template name itself
    const [, ...args] = splitOnTopLevelTokens(templateBody, '|');

    const positional: WikiText[] = [];
    const named = new Map<string, WikiText>();

    for (const arg of args) {
        const [name, ...valueParts] = splitOnTopLevelTokens(arg, '=');

        if (valueParts.length > 0 && /^\s*[A-Za-z_][\w-]*\s*$/.test(name)) {
            named.set(name.trim(), valueParts.join('='));
        } else {
            positional.push(arg);
        }
    }

    return { positional, named };
}

export function extractTemplatePropertyValue(
    wikiText: WikiText,
    templatePropertyName: string,
): WikiText {
    const templatePropertyRegExp = new RegExp(`\\|\\s*${templatePropertyName}\\s*=(.*)`, 's');
    const templatePropertyValueCandidate = templatePropertyRegExp.exec(wikiText)?.[1] ?? '';

    // templatePropertyValueCandidate exceeds the template property value
    // so we need to find the actual template property value end
    const boundaryTokensRegExp = /\||\{\{|\}\}/g;
    let match: RegExpExecArray | null;
    let nestingDepth = 0;
    while ((match = boundaryTokensRegExp.exec(templatePropertyValueCandidate))) {
        if (match[0] === '|' && nestingDepth > 0) {
            continue;
        }
        if (match[0] === '|') {
            return templatePropertyValueCandidate.substring(0, match.index);
        }
        if (match[0] === '}}' && nestingDepth === 0) {
            return templatePropertyValueCandidate.substring(0, match.index);
        }

        nestingDepth += match[0] === '{{' ? 1 : -1;
    }

    return '';
}

export function extractSection(wikiText: WikiText, sectionName: string, level: number): WikiText {
    const targetSectionRegExp = new RegExp(
        `={${level}}\\s*${sectionName}\\s*={${level}}\\s*\\n.*`,
        's',
    );
    const sectionCandidate = targetSectionRegExp.exec(wikiText)?.[0] ?? '';

    // sectionCandidate can exceed the section end if another section follows
    // so we need to find the actual section end
    const sectionRegExp = new RegExp(`(^|\\n)\\s*={${level}}[^=]*?={${level}}\\s*\\n`, 'gs');
    // exec finds the target section
    sectionRegExp.exec(sectionCandidate);
    // to find next section we call it again (uses stateful RegExp by using global flag)
    const nextSection = sectionRegExp.exec(sectionCandidate);

    return sectionCandidate.substring(0, nextSection?.index);
}

export function normalize(wikiText: WikiText | undefined): WikiText {
    return wikiText?.replace(/\n/g, ' ').trim() ?? '';
}

// Splits on every occurrence of the separator that is not nested inside a template ('{{...}}')
// or a wiki link ('[[...]]'), both of which use the separator themselves.
function splitOnTopLevelTokens(wikiText: WikiText, separator: '|' | '='): WikiText[] {
    const parts: WikiText[] = [];
    let currentPart = '';
    let nestingDepth = 0;

    for (let index = 0; index < wikiText.length; index++) {
        const boundaryToken = wikiText.substring(index, index + 2);

        if (boundaryToken === '{{' || boundaryToken === '[[') {
            nestingDepth++;
        } else if (boundaryToken === '}}' || boundaryToken === ']]') {
            nestingDepth--;
        } else {
            if (wikiText[index] === separator && nestingDepth === 0) {
                parts.push(currentPart);
                currentPart = '';
            } else {
                currentPart += wikiText[index];
            }
            continue;
        }

        currentPart += boundaryToken;
        index++;
    }

    parts.push(currentPart);

    return parts;
}
