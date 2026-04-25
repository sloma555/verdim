// Adicione seu UID aqui após o primeiro login
export const SUPER_ADMIN_UIDS: string[] = [
  "lsDmBvZUhdYaEH4C9qx39gxODA03",
  "f4F78ZwgV6T9CoSrjBWqqowmB352",
];

export const isSuperAdmin = (uid: string): boolean => SUPER_ADMIN_UIDS.includes(uid);
