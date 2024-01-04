import React, { useEffect, useState } from 'react';
import { apiget, apipost, apidelete } from "../API/Api";

const Member = {
  // Mitglieder abrufen
  getAllMembers: async () => {
    const members = await apiget('/members');
    return members;
  },

  // Mitglied hinzufügen
  addMember: async (memberData) => {
    console.log("apipost: Mitglied hinzufügen - Implementiere apipost-Funktion");
    const newMember = await apipost('/members', memberData);
    return newMember;
  },

  // Mitglied entfernen
  removeMember: async (memberId) => {
    console.log("apidelete: Mitglied entfernen - Implementiere apidelete-Funktion");
    await apidelete(`/members/${memberId}`);
  },
};

export default Member;
