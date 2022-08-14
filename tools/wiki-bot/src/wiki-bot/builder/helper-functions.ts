import { WikiText } from '../wiki-client/api-models';

export function extractTemplate(wikiText: WikiText, templateName: string): WikiText {
    const templateRegExp = new RegExp(`{{${templateName}.*}}`, 's');
    const templateCandidate = templateRegExp.exec(wikiText)?.[0] ?? '';

    // templateCandidate can exceed the template end if another template follows
    // so we need to find the actual template end
    const boundaryTokensRegExp = /\{\{|\}\}/gs;
    let match: RegExpExecArray | null;
    let nestingDepth = 0;
    while ((match = boundaryTokensRegExp.exec(templateCandidate))) {
        nestingDepth += match[0] === '{{' ? 1 : -1;
        if (nestingDepth === 0) {
            return templateCandidate.substring(0, match.index + '}}'.length);
        }
    }

    return '';
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
