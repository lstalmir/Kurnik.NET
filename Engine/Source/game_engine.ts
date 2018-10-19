import * as mod_Core from "./core/index";
import * as mod_Game from "./engine/index";
import * as mod_Geometry from "./geometry/index";
import * as mod_Rendering from "./rendering/index";

export
{
    mod_Core,
    mod_Game,
    mod_Geometry,
    mod_Rendering
}


export class CApplication
{
    private mCanvas: HTMLCanvasElement;
    private mGL: WebGLRenderingContext;
    private mContext: mod_Rendering.mod_Context.CContext;
    private mRenderer: mod_Rendering.mod_Renderer.CRenderer;
    private mWorld: mod_Game.mod_World.CWorld;


    //////////////////////////////////////////////////////////////////////////
    constructor()
    {
        this.mCanvas = document.querySelector( "#GameWindow" );
        this.mContext = new mod_Rendering.mod_Context.CContext( this.mCanvas );
        this.mGL = this.mContext.GetGLContext();
        this.mRenderer = new mod_Rendering.mod_Renderer.CRenderer( this.mContext );
        this.mRenderer.Clear();

        this.mWorld = new mod_Game.mod_World.CWorld( this.mContext, "SimpleWorld" );
    };

    //////////////////////////////////////////////////////////////////////////
    public Run()
    {
        this.mRenderer.Render( this.mWorld );
    };
};
