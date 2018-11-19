import { ITexture } from "./texture";
import { FColor, EColor } from "../core/color";
import { CContext } from "../rendering/context";

export class CMaterial
{
    public Name: string;
    public DiffuseTexture: ITexture;
    public SpecularTexture: ITexture;
    public NormalTexture: ITexture;
    public AlphaTexture: ITexture;
    public DiffuseColor: FColor;
    public SpecularValue: number;
    public SpecularExponent: number;
    public Transparency: number;

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new material.
    // @param name [in] Name of the new material.
    public constructor( name: string )
    {
        this.Name = name;
        this.DiffuseTexture = null;
        this.SpecularTexture = null;
        this.NormalTexture = null;
        this.AlphaTexture = null;
        this.DiffuseColor = FColor.Get( EColor.Gray );
        this.SpecularValue = 0.5;
        this.SpecularExponent = 2;
        this.Transparency = 0;
    };

    //////////////////////////////////////////////////////////////////////////
    public Use( context: CContext ): void
    {
        if ( context.GetMaterial() == this )
            return;

        context.GetDebug().Log( this.Name + " material set" );
        context.SetMaterial( this );
    };
};
