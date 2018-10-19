import { CTexture } from "./texture";
import { FColor, EColor } from "../core/color";

export class CMaterial
{
    protected mName: string;
    protected mDiffuseTexture: CTexture;
    protected mSpecularTexture: CTexture;
    protected mAlphaTexture: CTexture;
    protected mDiffuseColor: FColor;
    protected mSpecularValue: number;
    protected mSpecularExponent: number;
    protected mTransparency: number;

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new material.
    // @param name [in] Name of the new material.
    public constructor( name: string )
    {
        this.mName = name;
        this.mDiffuseTexture = null;
        this.mSpecularTexture = null;
        this.mAlphaTexture = null;
        this.mDiffuseColor = FColor.Get( EColor.Gray );
        this.mSpecularValue = 0.5;
        this.mSpecularExponent = 2;
        this.mTransparency = 0;
    };
};
