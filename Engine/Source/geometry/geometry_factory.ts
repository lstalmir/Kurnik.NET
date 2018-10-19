import { CObject } from "../engine/object";

export interface IGeometryFactory
{
    //////////////////////////////////////////////////////////////////////////
    // @brief Generate vertex and index data for the geometry.
    Create(): CObject;
};
