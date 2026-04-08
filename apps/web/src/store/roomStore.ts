import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Participant } from '@duwitch/types'

interface RoomState {
  roomId: string | null
  participants: Participant[]
  isMuted: boolean
  isCameraOff: boolean
  isSharingScreen: boolean
  isRecording: boolean
  setRoomId: (id: string | null) => void
  setParticipants: (participants: Participant[]) => void
  toggleMute: () => void
  toggleCamera: () => void
  toggleScreenShare: () => void
  toggleRecording: () => void
  leaveRoom: () => void
}

export const useRoomStore = create<RoomState>()(
  devtools(
    set => ({
      roomId: null,
      participants: [],
      isMuted: false,
      isCameraOff: false,
      isSharingScreen: false,
      isRecording: false,
      setRoomId: id => set({ roomId: id }, false, 'setRoomId'),
      setParticipants: participants => set({ participants }, false, 'setParticipants'),
      toggleMute: () => set(s => ({ isMuted: !s.isMuted }), false, 'toggleMute'),
      toggleCamera: () => set(s => ({ isCameraOff: !s.isCameraOff }), false, 'toggleCamera'),
      toggleScreenShare: () =>
        set(s => ({ isSharingScreen: !s.isSharingScreen }), false, 'toggleScreenShare'),
      toggleRecording: () => set(s => ({ isRecording: !s.isRecording }), false, 'toggleRecording'),
      leaveRoom: () =>
        set(
          {
            roomId: null,
            participants: [],
            isMuted: false,
            isCameraOff: false,
            isSharingScreen: false,
            isRecording: false,
          },
          false,
          'leaveRoom'
        ),
    }),
    { name: 'RoomStore' }
  )
)
