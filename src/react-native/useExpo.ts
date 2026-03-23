import { useEffect, useState } from 'react';
import { logWarning } from '../_/utils';

type Expo = {
    Image?: unknown;
    VideoView?: unknown;
    useVideoPlayer?: unknown;
}
type Module = `Image` | `Video`;

const messageConfig: Record< Module, string > = {
    "Image":
        // eslint-disable-next-line max-len
        `Image Caching requires 'expo' and 'expo-image' dependencies.`,
    "Video":
        // eslint-disable-next-line max-len
        `TwicVideo requires 'expo' and 'expo-video' dependencies.`,
};

/**
 * stores already loaded libraries
 */
const _expo: Expo = {};

/**
 * requires optional `expo-video`
 */
const requireExpoVideo = ( module: Module ) => {
    if ( ( module === `Video` ) && ( _expo.VideoView === undefined ) ) {
        try {
            // eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
            const expoVideo = require( `expo-video` );
            _expo.VideoView = expoVideo.VideoView;
            _expo.useVideoPlayer = expoVideo.useVideoPlayer;
        } catch {
            _expo.VideoView = null;
            _expo.useVideoPlayer = null;
        }
    }
};

/**
 * requires optional `expo-image`
 */
const requireExpoImage = ( module: Module ) => {
    if ( ( module === `Image` ) && ( _expo.Image === undefined ) ) {
        try {
            // eslint-disable-next-line no-shadow, no-undef, @typescript-eslint/no-var-requires
            const { Image } = require( `expo-image` );
            _expo.Image = Image;
        } catch {
            _expo.Image = null;
        }
    }
};

export default ( module: Module ) => {
    const [ expo, setExpo ] = useState< Expo >( _expo );
    useEffect( () => {
        const needsLoad =
            ( ( module === `Image` ) && ( _expo.Image === undefined ) ) ||
            ( ( module === `Video` ) && ( _expo.VideoView === undefined ) );
        if ( needsLoad ) {
            requireExpoVideo( module );
            requireExpoImage( module );
            const loaded = module === `Video` ? _expo.VideoView : _expo[ module ];
            if ( !loaded ) {
                logWarning( messageConfig[ module ] );
            }
            setExpo( { ..._expo } );
        }
    }, [] );
    return expo;
};
