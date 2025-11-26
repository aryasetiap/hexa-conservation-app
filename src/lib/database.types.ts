export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
	public: {
		Tables: {
			user_sessions: {
				Row: {
					id: string;
					user_id: string;
					email: string | null;
					logged_in_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					email?: string | null;
					logged_in_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					email?: string | null;
					logged_in_at?: string;
				};
			};

			projects: {
				Row: {
					id: string;
					user_id: string;
					project_name: string;
					operation_type: string;
					original_geojson: Json | null;
					processed_geojson: Json | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					project_name: string;
					operation_type: string;
					original_geojson?: Json | null;
					processed_geojson?: Json | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					project_name?: string;
					operation_type?: string;
					original_geojson?: Json | null;
					processed_geojson?: Json | null;
					created_at?: string;
				};
			};
		};
		Views: {
			[key: string]: Record<string, never>;
		};
		Functions: {
			[key: string]: Record<string, never>;
		};
	};
};
