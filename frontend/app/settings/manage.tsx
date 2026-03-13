import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import {
    DiscoveryPreferences,
    DistancePreference,
    Drinking,
    EducationLevel,
    FitnessLevel,
    GenderOption,
    HasChildren,
    Language,
    Interest,
    PersonalityTrait,
    Pronouns,
    RelationshipIntention,
    SetLocationRequest,
    Smoking,
    UpdateProfileRequest,
    WantsChildren,
    useGetInterestsQuery,
    useGetLanguagesQuery,
    useGetMyProfileQuery,
    useGetPersonalityTraitsQuery,
    useSetDiscoveryPreferencesMutation,
    useSetInterestedInMutation,
    useSetInterestsMutation,
    useSetLanguagesMutation,
    useSetLocationMutation,
    useSetPersonalityTraitsMutation,
    useUpdateProfileMutation,
} from "@/src/store/Apis/ProfileApi";
import {
    UpdateUserRequest,
    useGetUserByIdQuery,
    useUpdateUserMutation,
} from "@/src/store/Apis/UsersApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

// ─── Option constants ─────────────────────────────────────────────────────────
const GENDER_OPTIONS: GenderOption[] = ["MALE", "FEMALE", "NON_BINARY", "OTHER"];
const ORIENTATION_OPTIONS = ["STRAIGHT", "GAY", "LESBIAN", "BISEXUAL", "ASEXUAL", "PANSEXUAL", "OTHER"] as const;
const PRONOUNS_OPTIONS: Pronouns[] = ["HE_HIM", "SHE_HER", "THEY_THEM", "OTHER"];
const INTENTION_OPTIONS: { value: RelationshipIntention; label: string }[] = [
    { value: "MARRIAGE", label: "Marriage" },
    { value: "LONG_TERM", label: "Long-term" },
    { value: "LONG_TERM_OPEN_SHORT", label: "Long-term, open to short" },
    { value: "SHORT_TERM_OPEN_LONG", label: "Short-term, open to long" },
    { value: "CASUAL", label: "Casual dating" },
    { value: "FRIENDSHIP", label: "Friendship" },
    { value: "FIGURING_OUT", label: "Still figuring it out" },
];
const SMOKING_OPTIONS: Smoking[] = ["NON_SMOKER", "OCCASIONALLY", "SMOKER"];
const DRINKING_OPTIONS: Drinking[] = ["NEVER", "SOCIALLY", "REGULARLY"];
const FITNESS_OPTIONS: { value: FitnessLevel; label: string }[] = [
    { value: "VERY_ACTIVE", label: "Very Active" },
    { value: "MODERATELY_ACTIVE", label: "Moderately Active" },
    { value: "NOT_ACTIVE", label: "Not Active" },
];
const HAS_CHILDREN_OPTIONS: HasChildren[] = ["YES", "NO"];
const WANTS_CHILDREN_OPTIONS: { value: WantsChildren; label: string }[] = [
    { value: "WANT", label: "Want" },
    { value: "DONT_WANT", label: "Don't want" },
    { value: "NOT_SURE", label: "Not sure" },
];
const EDUCATION_OPTIONS: { value: EducationLevel; label: string }[] = [
    { value: "HIGH_SCHOOL", label: "High School" },
    { value: "COLLEGE", label: "College" },
    { value: "BACHELORS", label: "Bachelor's" },
    { value: "MASTERS", label: "Master's" },
    { value: "PHD", label: "PhD" },
];
const DISTANCE_OPTIONS: { value: DistancePreference; label: string }[] = [
    { value: "KM_10", label: "10 km" },
    { value: "KM_50", label: "50 km" },
    { value: "KM_100", label: "100 km" },
    { value: "GLOBAL", label: "Global" },
];
const VISIBILITY_OPTIONS = ["PUBLIC", "PRIVATE", "FRIENDS_ONLY"] as const;

function labelOf(val: string) {
    return val.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, icon, accent, colors }: { title: string; icon: string; accent: string; colors: any }) {
    return (
        <View style={[sectionStyles.row, { borderBottomColor: colors.border }]}>
            <View style={[sectionStyles.iconCircle, { backgroundColor: `${accent}22` }]}>
                <Ionicons name={icon as any} size={15} color={accent} />
            </View>
            <Text style={[sectionStyles.title, { color: colors.text }]}>{title}</Text>
        </View>
    );
}

// ─── Simple chip row for enum values ─────────────────────────────────────────
function Chips({
    options,
    selected,
    onSelect,
    accent,
    colors,
}: {
    options: { value: string; label: string }[];
    selected: string | string[] | null;
    onSelect: (val: string) => void;
    accent: string;
    colors: any;
}) {
    const isActive = (v: string) =>
        Array.isArray(selected) ? selected.includes(v) : selected === v;

    return (
        <View style={chipStyles.grid}>
            {options.map((opt) => {
                const active = isActive(opt.value);
                return (
                    <Pressable
                        key={opt.value}
                        onPress={() => onSelect(opt.value)}
                        style={[
                            chipStyles.chip,
                            { backgroundColor: active ? accent : colors.surface, borderColor: active ? accent : colors.border },
                        ]}
                    >
                        <Text style={[chipStyles.chipText, { color: active ? "#fff" : colors.subtext }]}>
                            {opt.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ManageAccountScreen() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { colors, accent } = useAppTheme();

    // ─── Queries ─────────────────────────────────────────────────────────────
    const { data: userRecord, isLoading: loadingUser } = useGetUserByIdQuery(
        currentUser?.id ?? "", { skip: !currentUser?.id }
    );
    const { data: fullProfile, isLoading: loadingFull } = useGetMyProfileQuery();
    const { data: allLanguages = [] } = useGetLanguagesQuery();
    const { data: allInterests = [] } = useGetInterestsQuery();
    const { data: allTraits = [] } = useGetPersonalityTraitsQuery();

    // ─── Mutations ───────────────────────────────────────────────────────────
    const [updateUser, { isLoading: savingUser }] = useUpdateUserMutation();
    const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();
    const [setLanguages, { isLoading: savingLangs }] = useSetLanguagesMutation();
    const [setInterests, { isLoading: savingInterests }] = useSetInterestsMutation();
    const [setTraits, { isLoading: savingTraits }] = useSetPersonalityTraitsMutation();
    const [setLocation, { isLoading: savingLocation }] = useSetLocationMutation();
    const [setInterestedIn, { isLoading: savingInterestedIn }] = useSetInterestedInMutation();
    const [setDiscovery, { isLoading: savingDiscovery }] = useSetDiscoveryPreferencesMutation();

    const isSaving = savingUser || savingProfile || savingLangs || savingInterests ||
        savingTraits || savingLocation || savingInterestedIn || savingDiscovery;

    // ─── Local state ─────────────────────────────────────────────────────────
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [gender, setGender] = useState<GenderOption | "">("");
    const [orientation, setOrientation] = useState("");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [pronouns, setPronouns] = useState<Pronouns | "">("");
    const [intention, setIntention] = useState<RelationshipIntention | "">("");
    const [interestedIn, setInterestedInLocal] = useState<GenderOption[]>([]);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(45);
    const [distancePref, setDistancePref] = useState<DistancePreference>("KM_50");
    const [selectedLangIds, setSelectedLangIds] = useState<string[]>([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
    const [selectedTraitIds, setSelectedTraitIds] = useState<string[]>([]);
    const [smoking, setSmoking] = useState<Smoking | "">("");
    const [drinking, setDrinking] = useState<Drinking | "">("");
    const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | "">("");
    const [hasChildren, setHasChildren] = useState<HasChildren | "">("");
    const [wantsChildren, setWantsChildren] = useState<WantsChildren | "">("");
    const [education, setEducation] = useState<EducationLevel | "">("");
    const [occupation, setOccupation] = useState("");
    const [industry, setIndustry] = useState("");
    const [ethnicity, setEthnicity] = useState("");

    // ─── Pre-populate from fetched data ──────────────────────────────────────
    useEffect(() => {
        if (userRecord) {
            setUsername(userRecord.username ?? "");
            setBio(userRecord.bio ?? "");
            setGender((userRecord.gender as GenderOption) ?? "");
            setOrientation((userRecord.orientation as string) ?? "");
            setVisibility((userRecord.visibility as string) ?? "PUBLIC");
        }
    }, [userRecord]);

    useEffect(() => {
        if (!fullProfile) return;
        setPronouns((fullProfile.pronouns as Pronouns) ?? "");
        setIntention((fullProfile.relationshipIntention as RelationshipIntention) ?? "");
        setInterestedInLocal(fullProfile.interestedIn?.map((r) => r.gender as GenderOption) ?? []);
        setCountry(fullProfile.location?.country ?? "");
        setCity(fullProfile.location?.city ?? "");
        setSmoking((fullProfile.smoking as Smoking) ?? "");
        setDrinking((fullProfile.drinking as Drinking) ?? "");
        setFitnessLevel((fullProfile.fitnessLevel as FitnessLevel) ?? "");
        setHasChildren((fullProfile.hasChildren as HasChildren) ?? "");
        setWantsChildren((fullProfile.wantsChildren as WantsChildren) ?? "");
        setEducation((fullProfile.educationLevel as EducationLevel) ?? "");
        setOccupation(fullProfile.occupation ?? "");
        setIndustry(fullProfile.industry ?? "");
        setEthnicity(fullProfile.ethnicity ?? "");
        if (fullProfile.discoveryPreferences) {
            setMinAge(fullProfile.discoveryPreferences.minAge ?? 18);
            setMaxAge(fullProfile.discoveryPreferences.maxAge ?? 45);
            setDistancePref((fullProfile.discoveryPreferences.distancePreference as DistancePreference) ?? "KM_50");
        }
    }, [fullProfile]);

    useEffect(() => {
        if (fullProfile && allLanguages.length > 0)
            setSelectedLangIds(fullProfile.languages?.map((l) => l.language.id) ?? []);
    }, [fullProfile, allLanguages]);

    useEffect(() => {
        if (fullProfile && allInterests.length > 0)
            setSelectedInterestIds(fullProfile.interests?.map((i) => i.interest.id) ?? []);
    }, [fullProfile, allInterests]);

    useEffect(() => {
        if (fullProfile && allTraits.length > 0)
            setSelectedTraitIds(fullProfile.personalityTraits?.map((t) => t.trait.id) ?? []);
    }, [fullProfile, allTraits]);

    // ─── Toggle helpers ───────────────────────────────────────────────────────
    const toggleGenderInterest = (g: GenderOption) =>
        setInterestedInLocal((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

    const toggleLang = (id: string) =>
        setSelectedLangIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

    const toggleInterest = (id: string) =>
        setSelectedInterestIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

    const toggleTrait = (id: string) => {
        if (selectedTraitIds.includes(id)) {
            setSelectedTraitIds((prev) => prev.filter((x) => x !== id));
        } else if (selectedTraitIds.length < 5) {
            setSelectedTraitIds((prev) => [...prev, id]);
        }
    };

    // ─── Save all ─────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!currentUser?.id) return;
        try {
            // 1. Basic user fields
            const userPayload: UpdateUserRequest = {};
            if (username.trim()) userPayload.username = username.trim();
            if (bio.trim() !== (userRecord?.bio ?? "")) userPayload.bio = bio.trim();
            if (gender) userPayload.gender = gender as UpdateUserRequest["gender"];
            if (orientation) userPayload.orientation = orientation as UpdateUserRequest["orientation"];
            if (visibility) userPayload.visibility = visibility as UpdateUserRequest["visibility"];
            if (Object.keys(userPayload).length > 0)
                await updateUser({ userId: currentUser.id, data: userPayload }).unwrap();

            // 2. Profile enum / scalar fields
            const profilePayload: UpdateProfileRequest = {};
            if (pronouns) profilePayload.pronouns = pronouns;
            if (intention) profilePayload.relationshipIntention = intention;
            if (smoking) profilePayload.smoking = smoking;
            if (drinking) profilePayload.drinking = drinking;
            if (fitnessLevel) profilePayload.fitnessLevel = fitnessLevel;
            if (hasChildren) profilePayload.hasChildren = hasChildren;
            if (wantsChildren) profilePayload.wantsChildren = wantsChildren;
            if (education) profilePayload.educationLevel = education;
            if (occupation.trim()) profilePayload.occupation = occupation.trim();
            if (industry.trim()) profilePayload.industry = industry.trim();
            if (ethnicity.trim()) profilePayload.ethnicity = ethnicity.trim();
            if (Object.keys(profilePayload).length > 0)
                await updateProfile(profilePayload).unwrap();

            // 3. Array / relational fields
            if (selectedLangIds.length > 0) await setLanguages(selectedLangIds).unwrap();
            if (selectedInterestIds.length > 0) await setInterests(selectedInterestIds).unwrap();
            if (selectedTraitIds.length > 0) await setTraits(selectedTraitIds).unwrap();
            if (country.trim() && city.trim())
                await setLocation({ country: country.trim(), city: city.trim() } as SetLocationRequest).unwrap();
            if (interestedIn.length > 0) await setInterestedIn(interestedIn).unwrap();
            if (minAge <= maxAge)
                await setDiscovery({ minAge, maxAge, distancePreference: distancePref } as Partial<DiscoveryPreferences>).unwrap();

            Toast.show({ type: "success", text1: "Profile updated!" });
        } catch (e: any) {
            Toast.show({
                type: "error",
                text1: "Save failed",
                text2: e?.data?.error ?? "Please try again",
            });
        }
    };

    if (loadingUser || loadingFull) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
                <View style={styles.center}>
                    <ActivityIndicator color={accent} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Pressable onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color={accent} />
                        </Pressable>
                        <Text style={[styles.header, { color: colors.text }]}>Edit Profile</Text>
                    </View>

                    <View style={styles.form}>

                        {/* ── BASIC INFO ──────────────────────────────────────── */}
                        <SectionHeader title="Basic Info" icon="person-outline" accent={accent} colors={colors} />

                        <Text style={[styles.label, { color: colors.subtext }]}>Username</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Your username"
                            placeholderTextColor={colors.subtext}
                            autoCapitalize="none"
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textarea, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell people about yourself..."
                            placeholderTextColor={colors.subtext}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={300}
                        />
                        <Text style={[styles.charCount, { color: colors.subtext }]}>{bio.length}/300</Text>

                        <Text style={[styles.label, { color: colors.subtext }]}>Pronouns</Text>
                        <Chips
                            options={PRONOUNS_OPTIONS.map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={pronouns}
                            onSelect={(v) => setPronouns(v as Pronouns)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Gender</Text>
                        <Chips
                            options={GENDER_OPTIONS.map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={gender}
                            onSelect={(v) => setGender(v as GenderOption)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Sexual orientation</Text>
                        <Chips
                            options={[...ORIENTATION_OPTIONS].map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={orientation}
                            onSelect={setOrientation}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Profile visibility</Text>
                        <Chips
                            options={[...VISIBILITY_OPTIONS].map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={visibility}
                            onSelect={setVisibility}
                            accent={accent} colors={colors}
                        />

                        {/* ── LOOKING FOR ─────────────────────────────────────── */}
                        <SectionHeader title="Looking For" icon="heart-outline" accent={accent} colors={colors} />

                        <Text style={[styles.label, { color: colors.subtext }]}>Relationship intention</Text>
                        <Chips
                            options={INTENTION_OPTIONS}
                            selected={intention}
                            onSelect={(v) => setIntention(v as RelationshipIntention)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Interested in (select all that apply)</Text>
                        <Chips
                            options={GENDER_OPTIONS.map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={interestedIn}
                            onSelect={(v) => toggleGenderInterest(v as GenderOption)}
                            accent={accent} colors={colors}
                        />

                        {/* ── LOCATION & DISCOVERY ──────────────────────────────── */}
                        <SectionHeader title="Location & Discovery" icon="location-outline" accent={accent} colors={colors} />

                        <Text style={[styles.label, { color: colors.subtext }]}>Country</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            value={country}
                            onChangeText={setCountry}
                            placeholder="e.g. Kenya"
                            placeholderTextColor={colors.subtext}
                            autoCapitalize="words"
                            maxLength={100}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>City</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            value={city}
                            onChangeText={setCity}
                            placeholder="e.g. Nairobi"
                            placeholderTextColor={colors.subtext}
                            autoCapitalize="words"
                            maxLength={100}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Age range for matches</Text>
                        <View style={styles.ageRow}>
                            <View style={styles.ageSide}>
                                <Text style={[styles.ageLabel, { color: colors.subtext }]}>Min</Text>
                                <View style={[styles.ageStepper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Pressable onPress={() => setMinAge((v) => Math.max(18, v - 1))} style={styles.stepBtn}>
                                        <Ionicons name="remove" size={16} color={accent} />
                                    </Pressable>
                                    <Text style={[styles.ageVal, { color: colors.text }]}>{minAge}</Text>
                                    <Pressable onPress={() => setMinAge((v) => Math.min(maxAge - 1, v + 1))} style={styles.stepBtn}>
                                        <Ionicons name="add" size={16} color={accent} />
                                    </Pressable>
                                </View>
                            </View>
                            <Text style={[styles.ageDash, { color: colors.subtext }]}>—</Text>
                            <View style={styles.ageSide}>
                                <Text style={[styles.ageLabel, { color: colors.subtext }]}>Max</Text>
                                <View style={[styles.ageStepper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Pressable onPress={() => setMaxAge((v) => Math.max(minAge + 1, v - 1))} style={styles.stepBtn}>
                                        <Ionicons name="remove" size={16} color={accent} />
                                    </Pressable>
                                    <Text style={[styles.ageVal, { color: colors.text }]}>{maxAge}</Text>
                                    <Pressable onPress={() => setMaxAge((v) => Math.min(100, v + 1))} style={styles.stepBtn}>
                                        <Ionicons name="add" size={16} color={accent} />
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <Text style={[styles.label, { color: colors.subtext }]}>Distance preference</Text>
                        <Chips
                            options={DISTANCE_OPTIONS}
                            selected={distancePref}
                            onSelect={(v) => setDistancePref(v as DistancePreference)}
                            accent={accent} colors={colors}
                        />

                        {/* ── LANGUAGES ────────────────────────────────────────── */}
                        <SectionHeader title="Languages" icon="language-outline" accent={accent} colors={colors} />
                        <Text style={[styles.hint, { color: colors.subtext }]}>Select all you speak</Text>
                        <View style={chipStyles.grid}>
                            {allLanguages.map((lang: Language) => {
                                const active = selectedLangIds.includes(lang.id);
                                return (
                                    <Pressable
                                        key={lang.id}
                                        onPress={() => toggleLang(lang.id)}
                                        style={[chipStyles.chip, { backgroundColor: active ? accent : colors.surface, borderColor: active ? accent : colors.border }]}
                                    >
                                        <Text style={[chipStyles.chipText, { color: active ? "#fff" : colors.subtext }]}>{lang.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* ── INTERESTS ────────────────────────────────────────── */}
                        <SectionHeader title="Interests & Hobbies" icon="telescope-outline" accent={accent} colors={colors} />
                        <Text style={[styles.hint, { color: colors.subtext }]}>Select all that apply</Text>
                        <View style={chipStyles.grid}>
                            {allInterests.map((item: Interest) => {
                                const active = selectedInterestIds.includes(item.id);
                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => toggleInterest(item.id)}
                                        style={[chipStyles.chip, { backgroundColor: active ? accent : colors.surface, borderColor: active ? accent : colors.border }]}
                                    >
                                        <Text style={[chipStyles.chipText, { color: active ? "#fff" : colors.subtext }]}>{item.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* ── PERSONALITY ──────────────────────────────────────── */}
                        <SectionHeader title="Personality Traits" icon="sparkles-outline" accent={accent} colors={colors} />
                        <Text style={[styles.hint, { color: colors.subtext }]}>
                            Pick up to 5 {selectedTraitIds.length > 0 ? `(${selectedTraitIds.length}/5 selected)` : ""}
                        </Text>
                        <View style={chipStyles.grid}>
                            {allTraits.map((trait: PersonalityTrait) => {
                                const active = selectedTraitIds.includes(trait.id);
                                const atMax = selectedTraitIds.length >= 5 && !active;
                                return (
                                    <Pressable
                                        key={trait.id}
                                        onPress={() => toggleTrait(trait.id)}
                                        style={[chipStyles.chip, { backgroundColor: active ? accent : colors.surface, borderColor: active ? accent : colors.border, opacity: atMax ? 0.4 : 1 }]}
                                    >
                                        <Text style={[chipStyles.chipText, { color: active ? "#fff" : colors.subtext }]}>{trait.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* ── LIFESTYLE ────────────────────────────────────────── */}
                        <SectionHeader title="Lifestyle" icon="leaf-outline" accent={accent} colors={colors} />

                        <Text style={[styles.label, { color: colors.subtext }]}>Smoking</Text>
                        <Chips
                            options={SMOKING_OPTIONS.map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={smoking}
                            onSelect={(v) => setSmoking(v as Smoking)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Drinking</Text>
                        <Chips
                            options={DRINKING_OPTIONS.map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={drinking}
                            onSelect={(v) => setDrinking(v as Drinking)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Fitness level</Text>
                        <Chips
                            options={FITNESS_OPTIONS}
                            selected={fitnessLevel}
                            onSelect={(v) => setFitnessLevel(v as FitnessLevel)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Do you have children?</Text>
                        <Chips
                            options={HAS_CHILDREN_OPTIONS.map((v) => ({ value: v, label: labelOf(v) }))}
                            selected={hasChildren}
                            onSelect={(v) => setHasChildren(v as HasChildren)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Do you want children?</Text>
                        <Chips
                            options={WANTS_CHILDREN_OPTIONS}
                            selected={wantsChildren}
                            onSelect={(v) => setWantsChildren(v as WantsChildren)}
                            accent={accent} colors={colors}
                        />

                        {/* ── BACKGROUND ───────────────────────────────────────── */}
                        <SectionHeader title="Background" icon="school-outline" accent={accent} colors={colors} />

                        <Text style={[styles.label, { color: colors.subtext }]}>Education level</Text>
                        <Chips
                            options={EDUCATION_OPTIONS}
                            selected={education}
                            onSelect={(v) => setEducation(v as EducationLevel)}
                            accent={accent} colors={colors}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Occupation</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            value={occupation}
                            onChangeText={setOccupation}
                            placeholder="e.g. Software Engineer"
                            placeholderTextColor={colors.subtext}
                            maxLength={100}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Industry</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            value={industry}
                            onChangeText={setIndustry}
                            placeholder="e.g. Technology"
                            placeholderTextColor={colors.subtext}
                            maxLength={100}
                        />

                        <Text style={[styles.label, { color: colors.subtext }]}>Ethnicity / Cultural background (optional)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            value={ethnicity}
                            onChangeText={setEthnicity}
                            placeholder="e.g. East African, Latino, Asian..."
                            placeholderTextColor={colors.subtext}
                            autoCapitalize="words"
                            maxLength={100}
                        />

                        {/* ── SAVE ─────────────────────────────────────────────── */}
                        <Pressable
                            style={[styles.saveBtn, { backgroundColor: accent, opacity: isSaving ? 0.7 : 1 }]}
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            )}
                        </Pressable>

                        <Pressable
                            style={[styles.verifyBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => router.push("/settings/phone-verify" as any)}
                        >
                            <Ionicons name="phone-portrait-outline" size={16} color={accent} />
                            <Text style={[styles.verifyBtnText, { color: accent }]}>Verify Phone Number</Text>
                        </Pressable>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const sectionStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 28,
        marginBottom: 14,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontSize: 15, fontWeight: "700" },
});

const chipStyles = StyleSheet.create({
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
    chip: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: { fontSize: 13, fontWeight: "500" },
});

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        gap: 8,
    },
    backBtn: { padding: 4 },
    header: { fontSize: 22, fontWeight: "700" },
    form: { paddingHorizontal: 20 },
    label: { fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 4 },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        fontSize: 15,
        marginBottom: 14,
    },
    textarea: { height: 100, textAlignVertical: "top" },
    charCount: { fontSize: 11, textAlign: "right", marginTop: -10, marginBottom: 10 },
    hint: { fontSize: 12, marginBottom: 8, marginTop: -4 },
    ageRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
    ageSide: { flex: 1, alignItems: "center", gap: 6 },
    ageLabel: { fontSize: 12, fontWeight: "600" },
    ageStepper: { flexDirection: "row", alignItems: "center", borderRadius: 10, borderWidth: 1, overflow: "hidden" },
    stepBtn: { paddingHorizontal: 12, paddingVertical: 8 },
    ageVal: { fontSize: 16, fontWeight: "700", paddingHorizontal: 8, minWidth: 36, textAlign: "center" },
    ageDash: { fontSize: 18, fontWeight: "300", marginTop: 20 },
    saveBtn: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    verifyBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 12,
        marginBottom: 8,
    },
    verifyBtnText: { fontWeight: "600", fontSize: 15 },
});
