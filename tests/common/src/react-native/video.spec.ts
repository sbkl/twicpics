import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe( 'expo-video migration', () => {

    describe( 'source code: no expo-av references remain', () => {

        it( 'should not reference expo-av in _Video.tsx', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).not.toContain( 'expo-av' );
        } );

        it( 'should not reference expo-av in useExpo.ts', () => {
            const source = readFileSync( 'src/react-native/useExpo.ts', 'utf8' );
            expect( source ).not.toContain( 'expo-av' );
        } );

        it( 'should not reference expo-av in build/units.js', () => {
            const source = readFileSync( 'build/units.js', 'utf8' );
            expect( source ).not.toContain( 'expo-av' );
        } );

        it( 'should not list expo-av in package.json dependencies', () => {
            const packageJson = JSON.parse( readFileSync( 'package.json', 'utf8' ) );
            expect( packageJson.dependencies ).not.toHaveProperty( 'expo-av' );
        } );
    } );

    describe( 'source code: expo-video is properly integrated', () => {

        it( 'should require expo-video in useExpo.ts', () => {
            const source = readFileSync( 'src/react-native/useExpo.ts', 'utf8' );
            expect( source ).toContain( 'expo-video' );
        } );

        it( 'should expose VideoView and useVideoPlayer from useExpo', () => {
            const source = readFileSync( 'src/react-native/useExpo.ts', 'utf8' );
            expect( source ).toContain( 'VideoView' );
            expect( source ).toContain( 'useVideoPlayer' );
        } );

        it( 'should list expo-video as external in build units', () => {
            const source = readFileSync( 'build/units.js', 'utf8' );
            expect( source ).toContain( 'expo-video' );
        } );

        it( 'should list expo-video in package.json dependencies', () => {
            const packageJson = JSON.parse( readFileSync( 'package.json', 'utf8' ) );
            expect( packageJson.dependencies ).toHaveProperty( 'expo-video' );
        } );

        it( 'should still list expo-image in package.json dependencies', () => {
            const packageJson = JSON.parse( readFileSync( 'package.json', 'utf8' ) );
            expect( packageJson.dependencies ).toHaveProperty( 'expo-image' );
        } );
    } );

    describe( 'Video component: uses expo-video API correctly', () => {

        it( 'should use VideoView component', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).toContain( 'VideoView' );
        } );

        it( 'should use useVideoPlayer hook', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).toContain( 'useVideoPlayer' );
        } );

        it( 'should use contentFit instead of resizeMode', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).toContain( 'contentFit' );
            expect( source ).not.toContain( 'resizeMode' );
        } );

        it( 'should use onFirstFrameRender instead of onReadyForDisplay', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).toContain( 'onFirstFrameRender' );
            expect( source ).not.toContain( 'onReadyForDisplay' );
        } );

        it( 'should configure player with loop and muted properties', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).toContain( 'p.loop = true' );
            expect( source ).toContain( 'p.muted = true' );
        } );

        it( 'should not use old expo-av Video props', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).not.toContain( 'isLooping' );
            expect( source ).not.toContain( 'isMuted' );
            expect( source ).not.toContain( 'shouldPlay' );
            expect( source ).not.toContain( 'usePoster' );
        } );

        it( 'should disable native controls', () => {
            const source = readFileSync( 'src/react-native/_Video.tsx', 'utf8' );
            expect( source ).toContain( 'nativeControls={ false }' );
        } );
    } );

    describe( 'useExpo: graceful fallback handling', () => {

        it( 'should still load expo-image independently for Image module', () => {
            const source = readFileSync( 'src/react-native/useExpo.ts', 'utf8' );
            expect( source ).toContain( 'expo-image' );
            expect( source ).toContain( `requireExpoImage` );
        } );

        it( 'should have separate loading for Video and Image', () => {
            const source = readFileSync( 'src/react-native/useExpo.ts', 'utf8' );
            expect( source ).toContain( 'requireExpoVideo' );
            expect( source ).toContain( 'requireExpoImage' );
        } );

        it( 'should handle missing expo-video with try/catch', () => {
            const source = readFileSync( 'src/react-native/useExpo.ts', 'utf8' );
            // requireExpoVideo should have a try/catch
            const videoFnMatch = source.match( /const requireExpoVideo[\s\S]*?^};/m );
            expect( videoFnMatch ).toBeTruthy();
            expect( videoFnMatch[ 0 ] ).toContain( 'try' );
            expect( videoFnMatch[ 0 ] ).toContain( 'catch' );
        } );

        it( 'should log warning when video module is missing', () => {
            const source = readFileSync( 'src/react-native/useExpo.ts', 'utf8' );
            expect( source ).toContain( 'logWarning' );
            expect( source ).toContain( `expo-video` );
        } );
    } );

    describe( 'Expo SDK 55 targeting', () => {

        it( 'should use Expo SDK 55 version', () => {
            const packageJson = JSON.parse( readFileSync( 'package.json', 'utf8' ) );
            const expoVersion = packageJson.dependencies.expo;
            expect( expoVersion ).toMatch( /55/ );
        } );

        it( 'should use expo-video SDK 55 version', () => {
            const packageJson = JSON.parse( readFileSync( 'package.json', 'utf8' ) );
            const videoVersion = packageJson.dependencies[ 'expo-video' ];
            expect( videoVersion ).toMatch( /55/ );
        } );

        it( 'should use expo-image SDK 55 version', () => {
            const packageJson = JSON.parse( readFileSync( 'package.json', 'utf8' ) );
            const imageVersion = packageJson.dependencies[ 'expo-image' ];
            expect( imageVersion ).toMatch( /55/ );
        } );
    } );
} );
