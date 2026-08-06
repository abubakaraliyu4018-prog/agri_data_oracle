CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone_number,
    farm_name,
    state,
    local_government_area,
    community_village,
    farm_size_hectares,
    main_crop,
    gender,
    farming_type
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'farm_name', ''),
    '',
    '',
    '',
    0,
    '',
    NULL,
    NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    phone_number = COALESCE(NULLIF(EXCLUDED.phone_number, ''), public.profiles.phone_number),
    farm_name = COALESCE(NULLIF(EXCLUDED.farm_name, ''), public.profiles.farm_name);
  RETURN NEW;
END;
$$;