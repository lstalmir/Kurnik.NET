import { CContext } from "./context";

export enum ERenderPass
{
    Geometry,
    Lighting,
    PostProcessing,
    UserInterface
};

export interface IRenderable
{
    //////////////////////////////////////////////////////////////////////////
    // @brief Render object implementing this interface.
    // @param context [in] Instance of WebGL context wrapper.
    // @param renderPass [in] Type of the current render pass.
    Render( context: CContext, renderPass: ERenderPass ): void;
};
