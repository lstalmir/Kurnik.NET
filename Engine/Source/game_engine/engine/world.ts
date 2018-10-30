import { IRenderable, ERenderPass } from "../rendering/renderable";
import { CContext } from "../rendering/context";
import { IDisposable } from "../core/disposable";
import { CObject } from "./object";
import { CMap } from "../core/map";
import { CMaterial } from "./material";

export class CWorld implements IRenderable, IDisposable
{
    protected mName: string;
    protected mObjects: CMap<CMaterial, CObject[]>;

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new CWorld instance.
    // @param name [in] Name of the world to create.
    public constructor( context: CContext, name: string )
    {
        this.mName = name;
        this.mObjects = new CMap<CMaterial, CObject[]>();
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Release all resources used by the objects.
    // @param gl [in] Instance of WebGL rendering context.
    public Dispose( gl: WebGLRenderingContext ): void
    {
        //for ( var object of this.mObjects.Pairs() )
        //{
        //    object.Dispose( gl );
        //}
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get name of the world.
    public GetName(): string
    {
        return this.mName;
    }
    
    //////////////////////////////////////////////////////////////////////////
    // @brief Render object implementing this interface.
    // @param context [in] Instance of WebGL context wrapper.
    // @param renderPass [in] Type of the current render pass.
    public Render( context: CContext, renderPass: ERenderPass ): void
    {
        for ( let material_object of this.mObjects.Pairs() )
        {
            material_object.First.Use( context );

            for ( let object of material_object.Second )
            {
                object.Render( context, renderPass );
            }
        }
    };
};
