import { GDebug } from "./game_engine/core/debug";
import { CContext } from "./game_engine/rendering/context";
import { CRenderer } from "./game_engine/rendering/renderer";
import { CWorld } from "./game_engine/engine/world";

export abstract class CApplication
{
    protected mCanvas: HTMLCanvasElement;
    protected mContext: CContext;
    protected mRenderer: CRenderer;
    protected mWorld: CWorld;
    protected mTargetRefreshRate: number;

    // Callbacks


    //////////////////////////////////////////////////////////////////////////
    constructor( canvasId: string, debugFlag: boolean = false, webgl2Flag: boolean = false )
    {
        this.mCanvas = document.querySelector( "#" + canvasId );
        this.mContext = new CContext( this.mCanvas, debugFlag, webgl2Flag );
        this.mRenderer = new CRenderer( this.mContext );
        this.mTargetRefreshRate = 60;
    };
};
