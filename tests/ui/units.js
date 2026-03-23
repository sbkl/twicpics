// This file defines the list of frameworks to be tested.
const units = [
  {
    "framework": `next`,
    "port": 4010,
  },
  {
    "framework": `react`,
    "port": 4040,
  },
]

export const getFrameworks = ( filters = `` ) => {
    const filterArray = filters.split( `,` ).map( f => f.trim() ).filter( f => f );
    const inclusiveFilters = filterArray.filter( f => !f.startsWith( `^` ) );
    const exclusiveFilters = filterArray.filter( f => f.startsWith( `^` ) ).map( f => f.substring(1) );
    let frameworks = units;

    if ( inclusiveFilters.length ) {
        const matchedFrameworks = units.filter(
            unit => inclusiveFilters.some( filter => new RegExp( `^${ filter }` ).test( unit.framework ) )
        );
        frameworks = matchedFrameworks.length ? matchedFrameworks : frameworks;
    }

    if ( exclusiveFilters.length ) {
        frameworks = frameworks.filter(
            unit => !exclusiveFilters.some( filter => new RegExp( `^${ filter }` ).test( unit.framework ) )
        );
    }

    return frameworks.length > 0 ? frameworks : units;
}
