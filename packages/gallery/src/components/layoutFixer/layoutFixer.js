import React from 'react';
import { isPrerenderMode } from 'pro-gallery-lib';

export const LayoutFixer = (props) => {
    // console.log('[LAYOUT FIXER] rendering', isPrerenderMode(), props);
    return (isPrerenderMode) ? (
        <>
            <script dangerouslySetInnerHTML={{__html: `console.log("[LAYOUT FIXER] Start (first script loaded)")`}}></script>
            <script dangerouslySetInnerHTML={{__html: `console.time("[LAYOUT FIXER] Done")`}}></script>
            <script src={props.layoutFixerBundleUrl}></script>
            <layout-fixer 
                parentId={props.parentId}
                items={JSON.stringify(props.items)}
                styles={JSON.stringify(props.styles)}
            ></layout-fixer>
        </>
    ) : null;}