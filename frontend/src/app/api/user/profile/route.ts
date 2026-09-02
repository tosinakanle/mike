import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        displayName: "Counsel",
        organisation: "LexNigeriana Legal Practice",
        jurisdiction: "Nigeria",
        practiceSetting: "law_firm",
        professionalTitle: "Barrister & Solicitor",
        practiceAreas: ["Corporate & Commercial", "Litigation", "Constitutional Law"],
        onboardingVersion: 1,
        onboardingComplete: true,
        passwordSet: true,
        messageCreditsUsed: 0,
        creditsResetDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        creditsRemaining: 1000000,
        tier: "LexNigeriana Superadmin",
        titleModel: "auto",
        tabularModel: "auto",
        lastSelectedChatModel: "auto",
        lastSelectedReasoningLevel: "high",
        mfaOnLogin: false,
        legalResearchUs: false,
        quickActionsVisible: true,
    });
}
