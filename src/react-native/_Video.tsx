import React, { useEffect } from "react";
import { styles } from "./styles";
import type { AssetAttributes } from "./types";
import useExpo from "./useExpo";
import { isSameAsset } from "./utils";

/**
 * Inner component that renders once expo-video is confirmed available.
 * This separation ensures useVideoPlayer (a React hook) is called unconditionally.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VideoPlayer = ( { VideoView, useVideoPlayer, uri, onLoad }: any ) => {
    const player = useVideoPlayer( uri || ``, ( p: any ) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        p.loop = true;
        p.muted = true;
    } );

    useEffect( () => {
        if ( player && uri ) {
            player.replace( uri );
            player.play();
        }
    }, [ uri ] );

    if ( !uri ) {
        return null;
    }

    return (
        <VideoView
            player={ player }
            contentFit="cover"
            nativeControls={ false }
            onFirstFrameRender={ onLoad }
            style={ [ styles.asset ] }
        />
    );
};

// eslint-disable-next-line react/display-name
export default React.memo( ( { onLoad, uri }: AssetAttributes ) => {
    const { VideoView, useVideoPlayer } = useExpo( `Video` );

    if ( !VideoView || !useVideoPlayer ) {
        return null;
    }

    return (
        <VideoPlayer
            VideoView={ VideoView }
            useVideoPlayer={ useVideoPlayer }
            uri={ uri }
            onLoad={ onLoad }
        />
    );
}, isSameAsset );
