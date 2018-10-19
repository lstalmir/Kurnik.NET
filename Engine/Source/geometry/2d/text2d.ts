import { CObject } from "../../engine/object";
import { CContext } from "../../rendering/context";
import { ERenderPass } from "../../rendering/renderable";
import { FVector2D } from "../../core/math/vector2d";
import { CFont } from "../../engine/font";

export class CText2D extends CObject
{
    private mText: string;
    private mSize: number;
    private mLocation: FVector2D;
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
    public constructor( context: CContext, name: string, text: string, size: number, location: FVector2D, font: CFont )
    {
        super( context, name, ERenderPass.UserInterface );

        this.mFont = font;
    }
};
