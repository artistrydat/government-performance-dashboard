export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    dashboardLayout: {
        widgets: Array<{
            id: string;
            type: string;
            position: {
                x: number;
                y: number;
            };
            size: {
                width: number;
                height: number;
            };
            visible: boolean;
        }>;
        layoutType: 'grid' | 'freeform';
    };
    defaultView: {
        executive: string;
        portfolio_manager: string;
        project_officer: string;
    };
    notifications: {
        email: boolean;
        push: boolean;
        riskAlerts: boolean;
        projectUpdates: boolean;
    };
    accessibility: {
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
        reducedMotion: boolean;
    };
}
export declare const defaultPreferences: Record<string, UserPreferences>;
export declare const getUserPreferences: import("convex/server").RegisteredQuery<"public", {
    userId: string;
}, Promise<UserPreferences>>;
export declare const updateUserPreferences: import("convex/server").RegisteredMutation<"public", {
    userId: string;
    preferences: {
        theme: "light" | "dark" | "auto";
        dashboardLayout: {
            widgets: {
                id: string;
                type: string;
                position: {
                    x: number;
                    y: number;
                };
                size: {
                    width: number;
                    height: number;
                };
                visible: boolean;
            }[];
            layoutType: "grid" | "freeform";
        };
        defaultView: {
            executive: string;
            portfolio_manager: string;
            project_officer: string;
        };
        notifications: {
            email: boolean;
            push: boolean;
            riskAlerts: boolean;
            projectUpdates: boolean;
        };
        accessibility: {
            fontSize: "medium" | "small" | "large";
            highContrast: boolean;
            reducedMotion: boolean;
        };
    };
}, Promise<{
    theme: "light" | "dark" | "auto";
    dashboardLayout: {
        widgets: {
            id: string;
            type: string;
            position: {
                x: number;
                y: number;
            };
            size: {
                width: number;
                height: number;
            };
            visible: boolean;
        }[];
        layoutType: "grid" | "freeform";
    };
    defaultView: {
        executive: string;
        portfolio_manager: string;
        project_officer: string;
    };
    notifications: {
        email: boolean;
        push: boolean;
        riskAlerts: boolean;
        projectUpdates: boolean;
    };
    accessibility: {
        fontSize: "medium" | "small" | "large";
        highContrast: boolean;
        reducedMotion: boolean;
    };
}>>;
export declare const resetUserPreferences: import("convex/server").RegisteredMutation<"public", {
    userId: string;
}, Promise<UserPreferences>>;
//# sourceMappingURL=userPreferences.d.ts.map