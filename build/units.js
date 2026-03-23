import banner2 from "rollup-plugin-banner2";

export default [
    {
        "external": [ `react` ],
        "formats": [ `cjs`, `es`, `types` ],
        "framework": `react`,
        "postTerser": [ banner2( () => `'use client';` ) ],
    },
    {
        "bundleCss": false,
        "external": [
            `expo-av`,
            `expo-image`,
            `react`,
            `react-dom`,
            `react-native`,
            `react-native-web`,
        ],
        "formats": [ `cjs`, `es`, `types` ],
        "framework": `react-native`,
        "sourcemap": false,
    },
    {
        "bundleCss": false,
        "external": [
            `react`,
            `react-dom`,
            `next`,
        ],
        "formats": [ `cjs`, `es`, `types` ],
        "framework": `next`,
    },
];
