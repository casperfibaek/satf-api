/*
  Utility functions
*/

export function translateUrbanClasses(klass:number) { // eslint-disable-line import/prefer-default-export
  if (Number.isNaN(klass)) { return 'Unknown'; }
  if (Number(klass) === 0) { return 'Rural'; }
  if (Number(klass) === 1) { return 'Suburban'; }
  if (Number(klass) === 2) { return 'Urban'; }
  if (Number(klass) === 3) { return 'Dense Urban'; }
  return 'Rural';
}
