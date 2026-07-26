import { TeamBuildingApplicationForm } from "@/features/public/grief-camp/components/team-building-application-form";

export const metadata = {
    title: "Team Building Application | Recro Grief Camp",
    description:
        "Apply for team building activities to support Recro Grief Camp. Bring your organization or group to make a difference.",
};

export default function TeamBuildingApplicationPage() {
    return <TeamBuildingApplicationForm />;
}
