import React from "react";

interface WithSoundProps {
    soundType: "positive" | "negative";
}

// todo: implement HOC such way, that sound is played on wrapped component click
// you can play sounds from SoundsContainer by getting those sounds by id or through the context - your choice
export function withSound<P extends WithSoundProps>(Component: React.FC<P>): React.FC<P> {
    const ButtonWithSound: React.FC<P> = ({ soundType, ...props }) => {
        return <Component {...props as P} />;
    };

    return ButtonWithSound;
}
