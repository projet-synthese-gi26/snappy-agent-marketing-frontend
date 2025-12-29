export const CONTACTS: Record<
    string,
    {
        name: string;
        online?: boolean;
    }
> = {
    sarah: {
        name: "Sarah (Marketing)",
        online: true,
    },
    jean: {
        name: "Jean Dupont",
        online: false,
    },
    "equipe-dev": {
        name: "Équipe Dev",
        online: true,
    },
};
