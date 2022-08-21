export interface Participant {
    uid: string,
    present: boolean
}

export interface InTimeEvent {
    id: string,
    title: string,
    time: Date,
    location: any,
    participants: Participant[]
}