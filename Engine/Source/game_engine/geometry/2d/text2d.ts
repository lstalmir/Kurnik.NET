import { CContext } from "../../rendering/context";
import { FVector2D } from "../../core/math/vector2d";
import { CFont } from "../../engine/font";
import { CInstancedObject } from "../../engine/instanced_object";
import { CRectangle } from "./rectangle";
import { CRectangleFactory } from "./rectangle_factory";
import { FVector } from "../../core/math/vector";

export class CText2D extends CInstancedObject<CRectangle>
{
    private mText: string;
    private mFont: CFont;

    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new 2D text object. All text instances are rendered
    //  in User Interface pass.
    // @param context [in] Instance of WebGL context wrapper.
    // @param name [in] Name of the text object.
    // @param text [in] Text to display.
    // @param size [in] Size of the text, in pixels.
    // @param location [in] Position of the top left corner of the text
    //  bounding box.
    public constructor( context: CContext, name: string, renderFlags: number, text: string, size: number, location: FVector2D, font: CFont )
    {
        super( context, name, renderFlags,
            new CRectangleFactory()
                .SetHeight( size )
                .SetWidth( size )
                .SetX( location.x )
                .SetY( location.y )
                .SetName( name + '-CHARACTER' )
                .SetRenderFlags( renderFlags )
                .GetBuilder() );

        this.mFont = font;

        for ( let i = 0; i < text.length; ++i )
        {
            let ch = text.charCodeAt( i );
            let choffset = this.mFont.GetCharacterOffset( ch );

            let texcoord = new FVector2D( choffset[0], choffset[1] );
            let position = new FVector( size * i, 0, 0 );

            this.AddInstance( context, position, texcoord );
        }
    }
};
