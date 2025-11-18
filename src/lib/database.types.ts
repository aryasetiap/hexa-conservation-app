
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
		};
		Views: {
			[key: string]: Record<string, never>;
		};
		Functions: {
			[key: string]: Record<string, never>;
		};
	};
};
