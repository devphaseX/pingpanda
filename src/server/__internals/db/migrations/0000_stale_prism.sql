CREATE TABLE "users" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"external_id" varchar(50) NOT NULL,
	"quota_limit" integer NOT NULL,
	"plan" varchar(50) DEFAULT 'FREE' NOT NULL,
	"email" varchar(255) NOT NULL,
	"api_key" varchar(255),
	"discord_id" varchar(50),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE "event_categories" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"colour" integer NOT NULL,
	"emoji" varchar(50) NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_event_unique" UNIQUE("name","user_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"fields" jsonb NOT NULL,
	"formatted_message" text NOT NULL,
	"deliver_status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"event_category_id" varchar(50),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quotas" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "event_categories" ADD CONSTRAINT "event_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_event_category_id_event_categories_id_fk" FOREIGN KEY ("event_category_id") REFERENCES "public"."event_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotas" ADD CONSTRAINT "quotas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "created_index" ON "events" USING btree ("created_at");