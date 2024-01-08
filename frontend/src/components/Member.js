import { apiget, apipost, apidelete } from "../API/Api";

const Member = {
  // Mitglieder abrufen
  getAllUsers: async () => {
    const members = await apiget('users');
    return members;
  },

  // Mitglied hinzufügen
  addMember: async (projectId, memberData) => {
    return await apipost(`project/${projectId}/user`, memberData);
  },

  // Mitglied entfernen
  removeMember: async (projectId, memberId) => {
    return await apidelete(`project/${projectId}/user`, memberId);
  },
};

export default Member;
