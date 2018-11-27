
export class CBombermanExternalResources
{
    static BackgroundImagePath: string; 
    static DefaultBlockTexturePath: string;
    static UserInterfaceStyleSheetPath: string;
    static PlayerImagePath: string;
    static PlayerMaskImagePath: string;

    static Initialized: boolean = false;

    static InitializePaths( useGlobalPaths: boolean = true ): void
    {
        let base = useGlobalPaths ? '/' : '';
        CBombermanExternalResources.BackgroundImagePath = base + 'images/background.png';
        CBombermanExternalResources.DefaultBlockTexturePath = base + 'images/default-block.png';
        CBombermanExternalResources.UserInterfaceStyleSheetPath = base + 'css/engine.css';
        CBombermanExternalResources.PlayerImagePath = base + 'images/player.png';
        CBombermanExternalResources.PlayerMaskImagePath = base + 'images/player-mask.png';

        CBombermanExternalResources.Initialized = true;
    };
};
