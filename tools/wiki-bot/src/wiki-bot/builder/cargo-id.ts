import { CargoEdition } from '../wiki-client/api-models';

// The Cargo _ID column is an auto-increment row id that the wiki reassigns
// whenever a page is reparsed. _pageID only changes when a page is deleted and
// recreated, so it is the identifier the generated data is pinned to.
export function buildCargoId(cargoEntity: { PageId: string }): string {
    return cargoEntity.PageId;
}

// An expansion page carries one Editions row per edition (Seaside 1st and 2nd
// edition share a page), so the page id alone is not unique here.
export function buildCargoEditionId(cargoEdition: CargoEdition): string {
    return `${cargoEdition.PageId}-${cargoEdition.Edition}`;
}
