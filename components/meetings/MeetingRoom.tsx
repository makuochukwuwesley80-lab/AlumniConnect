"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";

type MeetingRoomProps = {
roomName: string;
displayName: string;
email: string;
};

export function MeetingRoom({
roomName,
displayName,
email,
}: MeetingRoomProps) {
return (
<div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl">
<JitsiMeeting
domain="meet.jit.si"
roomName={roomName}
configOverwrite={{
startWithAudioMuted: false,
startWithVideoMuted: false,
prejoinPageEnabled: true,
}}
interfaceConfigOverwrite={{
SHOW_JITSI_WATERMARK: false,
SHOW_WATERMARK_FOR_GUESTS: false,
}}
userInfo={{
displayName,
email,
}}
getIFrameRef={(iframe) => {
iframe.style.height = "85vh";
iframe.style.width = "100%";
iframe.style.border = "0";
}}
/>
</div>
);
}
