import { NextResponse } from "next/server";

export async function GET() {
    const quickActions = [
        {
            id: "qa-1",
            user_id: "lex-counsel-01",
            workflow_id: "wf-cama",
            name: "CAMA 2020 Compliance Check",
            prompt: "Review this document for corporate compliance under the Companies and Allied Matters Act (CAMA) 2020. Identify potential statutory non-compliance, filing obligations, and director liability issues.",
            document_upload: true,
            surface: "app",
            enabled: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            workflow: { id: "wf-cama", title: "CAMA 2020 Compliance" },
        },
        {
            id: "qa-2",
            user_id: "lex-counsel-01",
            workflow_id: "wf-affidavit",
            name: "Draft Affidavit of Urgency",
            prompt: "Draft an Affidavit of Urgency in support of a Motion Ex-Parte pursuant to the High Court Civil Procedure Rules. Include standard averments of extreme urgency, lack of alternative remedy, and irreparable damage.",
            document_upload: false,
            surface: "app",
            enabled: true,
            sort_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            workflow: { id: "wf-affidavit", title: "Draft Affidavit of Urgency" },
        },
        {
            id: "qa-3",
            user_id: "lex-counsel-01",
            workflow_id: "wf-citation",
            name: "Verify Nigerian Case Citations",
            prompt: "Verify the legal citations in this text according to Nigerian Supreme Court and Court of Appeal standards (e.g. NWLR, LPELR, SCNJ). Confirm whether the principles cited reflect settled law.",
            document_upload: true,
            surface: "app",
            enabled: true,
            sort_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            workflow: { id: "wf-citation", title: "Citation Verification" },
        },
        {
            id: "qa-4",
            user_id: "lex-counsel-01",
            workflow_id: "wf-jurisdiction",
            name: "Jurisdiction & Locus Standi Analysis",
            prompt: "Analyze the question of subject-matter jurisdiction and locus standi under Section 251 of the 1999 Constitution and leading appellate precedents (Madukolu v. Nkemdilim, Adesanya v. President of FRN).",
            document_upload: true,
            surface: "app",
            enabled: true,
            sort_order: 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            workflow: { id: "wf-jurisdiction", title: "Jurisdictional Analysis" },
        },
    ];

    return NextResponse.json(quickActions);
}
