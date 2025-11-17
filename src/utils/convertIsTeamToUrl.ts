export const convertIsTeamToUrl = (isTeam: boolean): string => {
  return isTeam ? 'team' : 'portfolio';
};