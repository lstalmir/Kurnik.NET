import { IGeometryFactory } from "../geometry_factory";
import { CObject } from "../../engine/object";
import { CContext } from "../../rendering/context";
import { CRectangle } from "./rectangle";
import { ERenderPass } from "../../rendering/renderable";

export class CRectangleFactory implements IGeometryFactory
{
    private context: CContext;
    private name: string;
    private renderFlags: number;
    private x: number;
    private y: number;
    private w: number;
    private h: number;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext )
    {
        this.context = context;
        this.name = 'unnamed';
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
        this.ResetRenderFlags();
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public Create(): CObject
    {
        return new CRectangle( this.context, this.name, this.w, this.h, this.x, this.y, this.renderFlags );
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

    //////////////////////////////////////////////////////////////////////////
    public SetRenderFlag( renderFlag: ERenderPass ): CRectangleFactory
    {
        this.renderFlags |= renderFlag;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public ResetRenderFlags(): CRectangleFactory
    {
        this.renderFlags = ERenderPass.Geometry;
        return this;
    };
};
