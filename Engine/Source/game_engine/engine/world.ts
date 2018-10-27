import { IRenderable, ERenderPass } from "../rendering/renderable";
import { CContext } from "../rendering/context";
import { CRectangleFactory } from "../geometry/2d/rectangle_factory";
import { IDisposable } from "../core/disposable";
import { CObject } from "./object";
import { CMap } from "../core/map";
import { CMaterial } from "./material";
import { FColor } from "../core/color";
import { CTexture2D } from "./texture";

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

        var material = new CMaterial( "mat" );
        material.DiffuseColor = new FColor( 0.5, 0.5, 0 );

        var checker_material = new CMaterial( "checker_mat" );
        checker_material.DiffuseColor = new FColor( 0.5, 0, 0 );
        checker_material.DiffuseTexture = new CTexture2D( context, "images/fonts/engine/default.png" );
        checker_material.SpecularTexture = new CTexture2D( context, "images/fonts/engine/default.png" );

        this.mObjects.Put( checker_material, new Array<CObject>() );
        this.mObjects.Put( material, new Array<CObject>() );

        var rectangleFactory = new CRectangleFactory();

        var background = rectangleFactory
            .SetWidth( 640 )
            .SetHeight( 480 )
            .SetRenderFlag( ERenderPass.Geometry )
            .SetName( "Background" )
            .Create( context );
        this.mObjects.Get( checker_material ).push( background );

        var rect = rectangleFactory
            .SetWidth( 100 )
            .SetHeight( 100 )
            .SetPosX( 20 )
            .SetPosY( 10 )
            .SetName( "Rectangle" )
            .SetRenderFlag( ERenderPass.Geometry )
            .Create( context );
        this.mObjects.Get( material ).push( rect );
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
