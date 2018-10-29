﻿import { IRenderable, ERenderPass } from "../rendering/renderable";
import { CRenderer } from "../rendering/renderer";
import { CContext } from "../rendering/context";
import { CRectangleFactory } from "../geometry/2d/rectangle_factory";
import { IDisposable } from "../core/disposable";
import { CObject } from "./object";

export class CWorld implements IRenderable, IDisposable
{
    private mName: string;
    private mObjects: CObject[];

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new CWorld instance.
    // @param name [in] Name of the world to create.
    public constructor( context: CContext, name: string )
    {
        this.mName = name;
        this.mObjects = new Array<CObject>();

        var rect = new CRectangleFactory( context )
            .SetWidth( 100 )
            .SetHeight( 100 )
            .SetPosX( 20 )
            .SetPosY( 10 )
            .SetName( "Rectangle" )
            .Create();

        this.mObjects.push( rect );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Release all resources used by the objects.
    // @param gl [in] Instance of WebGL rendering context.
    public Dispose( gl: WebGLRenderingContext ): void
    {
        for ( var object of this.mObjects )
        {
            object.Dispose( gl );
        }
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
        for ( let object of this.mObjects )
        {
            object.Render( context, renderPass );
        }
    };
};