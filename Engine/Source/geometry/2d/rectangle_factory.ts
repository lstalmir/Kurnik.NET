import { IGeometryFactory } from "../geometry_factory";
import { CObject } from "../../game/object";
import { CContext } from "../../rendering/context";
import { CRectangle } from "./rectangle";

export class CRectangleFactory implements IGeometryFactory
{
    private context: CContext;
    private name: string;
    private x: number;
    private y: number;
    private w: number;
    private h: number;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext )
    {
        this.context = context;
        this.Reset();
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Reset factory settings to defaults.
    public Reset(): CRectangleFactory
    {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public Create(): CObject
    {
        return new CRectangle( this.context, this.name, this.w, this.h, this.x, this.y );
    };

    //////////////////////////////////////////////////////////////////////////
    public SetName( name: string ): CRectangleFactory
    {
        this.name = name;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetWidth( width: number ): CRectangleFactory
    {
        this.w = width;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetHeight( height: number ): CRectangleFactory
    {
        this.h = height;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetPosX( x: number ): CRectangleFactory
    {
        this.x = x;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetPosY( y: number ): CRectangleFactory
    {
        this.y = y;
        return this;
    };
};
