// app/Auth/complete-profile.tsx
import { useAppTheme } from "@/src/hooks/useAppTheme";
import {
    DistancePreference,
    Drinking,
    EducationLevel,
    FitnessLevel,
    GenderOption,
    HasChildren,
    Pronouns,
    RelationshipIntention,
    Smoking,
    WantsChildren,
    useGetInterestsQuery,
    useGetLanguagesQuery,
    useGetPersonalityTraitsQuery,
    useSetDiscoveryPreferencesMutation,
    useSetInterestedInMutation,
    useSetInterestsMutation,
    useSetLanguagesMutation,
    useSetLocationMutation,
    useSetPersonalityTraitsMutation,
    useUpdateProfileMutation,
} from "@/src/store/Apis/ProfileApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
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

const { width } = Dimensions.get("window");
const TOTAL_STEPS = 9;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function label(val: string) {
    return val
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({
    text,
    active,
    onPress,
    accent,
    colors,
}: {
    text: string;
    active: boolean;
    onPress: () => void;
    accent: string;
    colors: any;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.chip,
                { backgroundColor: active ? accent : "rgba(255,255,255,0.15)" },
            ]}
        >
            <Text style={[styles.chipText, { color: active ? "#fff" : "rgba(255,255,255,0.85)" }]}>
                {text}
            </Text>
        </Pressable>
    );
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
    return <Text style={styles.sectionLabel}>{text}</Text>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CompleteProfileScreen() {
    const router = useRouter();
    const { accent } = useAppTheme();

    // ─── Mutations ──────────────────────────────────────────────────────────────
    const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();
    const [setInterestedIn, { isLoading: savingInterested }] = useSetInterestedInMutation();
    const [setDiscoveryPrefs, { isLoading: savingDiscovery }] = useSetDiscoveryPreferencesMutation();
    const [setLanguages, { isLoading: savingLangs }] = useSetLanguagesMutation();
    const [setTraits, { isLoading: savingTraits }] = useSetPersonalityTraitsMutation();
    const [setLocation, { isLoading: savingLocation }] = useSetLocationMutation();
    const [setInterests, { isLoading: savingInterests }] = useSetInterestsMutation();

    const { data: allLanguages = [] } = useGetLanguagesQuery();
    const { data: allTraits = [] } = useGetPersonalityTraitsQuery();
    const { data: allInterests = [] } = useGetInterestsQuery();

    const isSaving = savingProfile || savingInterested || savingDiscovery || savingLangs || savingTraits || savingLocation || savingInterests;

    // ─── Step state ─────────────────────────────────────────────────────────────
    const [step, setStep] = useState(0);
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Step 1 – About You
    const [pronouns, setPronouns] = useState<Pronouns | null>(null);
    const [bio, setBio] = useState("");

    // Step 2 – Looking For
    const [intention, setIntention] = useState<RelationshipIntention | null>(null);
    const [interestedIn, setInterestedInLocal] = useState<GenderOption[]>([]);

    // Step 3 – Lifestyle
    const [smoking, setSmoking] = useState<Smoking | null>(null);
    const [drinking, setDrinking] = useState<Drinking | null>(null);
    const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | null>(null);
    const [hasChildren, setHasChildren] = useState<HasChildren | null>(null);
    const [wantsChildren, setWantsChildren] = useState<WantsChildren | null>(null);

    // Step 4 – Background
    const [education, setEducation] = useState<EducationLevel | null>(null);
    const [occupation, setOccupation] = useState("");
    const [industry, setIndustry] = useState("");

    // Step 5 – Discovery
    const [minAge, setMinAge] = useState("18");
    const [maxAge, setMaxAge] = useState("45");
    const [distancePref, setDistancePref] = useState<DistancePreference>("KM_50");

    // Languages
    const [selectedLanguageIds, setSelectedLanguageIds] = useState<string[]>([]);

    // Interests
    const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);

    // Personality Traits
    const [selectedTraitIds, setSelectedTraitIds] = useState<string[]>([]);

    // Location
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");

    // Ethnicity (optional)
    const [ethnicity, setEthnicity] = useState("");

    // ─── Navigation ─────────────────────────────────────────────────────────────
    const animateToStep = (next: number) => {
        Animated.timing(slideAnim, {
            toValue: -width * next,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setStep(next));
        slideAnim.setValue(-width * next);
    };

    const goNext = () => {
        if (step < TOTAL_STEPS - 1) animateToStep(step + 1);
    };

    const goBack = () => {
        if (step > 0) animateToStep(step - 1);
    };

    // Toggle multi-select
    const toggleGender = (g: GenderOption) => {
        setInterestedInLocal((prev) =>
            prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
        );
    };

    const toggleLanguage = (id: string) => {
        setSelectedLanguageIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleTrait = (id: string) => {
        setSelectedTraitIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleInterest = (id: string) => {
        setSelectedInterestIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ─── Save & Finish ───────────────────────────────────────────────────────────
    const handleFinish = async () => {
        try {
            // Core profile fields
            const profilePayload: Record<string, any> = {};
            if (pronouns) profilePayload.pronouns = pronouns;
            if (bio.trim()) profilePayload.bio = bio.trim();
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

            if (Object.keys(profilePayload).length > 0) {
                await updateProfile(profilePayload).unwrap();
            }

            // Languages
            if (selectedLanguageIds.length > 0) {
                await setLanguages(selectedLanguageIds).unwrap();
            }

            // Interests
            if (selectedInterestIds.length > 0) {
                await setInterests(selectedInterestIds).unwrap();
            }

            // Personality traits
            if (selectedTraitIds.length > 0) {
                await setTraits(selectedTraitIds).unwrap();
            }

            // Location
            if (country.trim() && city.trim()) {
                await setLocation({ country: country.trim(), city: city.trim() }).unwrap();
            }

            // Interested in
            if (interestedIn.length > 0) {
                await setInterestedIn(interestedIn).unwrap();
            }

            // Discovery preferences
            const min = Number(minAge);
            const max = Number(maxAge);
            if (!isNaN(min) && !isNaN(max) && min <= max) {
                await setDiscoveryPrefs({
                    minAge: min,
                    maxAge: max,
                    distancePreference: distancePref,
                }).unwrap();
            }

            Toast.show({ type: "success", text1: "Profile complete! 🎉" });
            router.replace("/(tabs)");
        } catch (err: any) {
            Toast.show({
                type: "error",
                text1: "Save failed",
                text2: err?.data?.error || "Please try again",
            });
        }
    };

    const handleSkip = () => {
        router.replace("/(tabs)");
    };

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={styles.gradient}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Progress bar */}
                <View style={styles.progressContainer}>
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressDot,
                                {
                                    flex: 1,
                                    backgroundColor: i <= step ? accent : "rgba(255,255,255,0.2)",
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Header */}
                <View style={styles.header}>
                    {step > 0 ? (
                        <Pressable onPress={goBack} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </Pressable>
                    ) : (
                        <View style={{ width: 40 }} />
                    )}
                    <Text style={styles.headerTitle}>
                        {STEP_TITLES[step]}
                    </Text>
                    <Pressable onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* ─── Step 1: About You ─── */}
                        {step === 0 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    Let people know who you are ✨
                                </Text>

                                <SectionLabel text="Your pronouns" />
                                <View style={styles.chipRow}>
                                    {(["HE_HIM", "SHE_HER", "THEY_THEM", "OTHER"] as Pronouns[]).map((p) => (
                                        <Chip
                                            key={p}
                                            text={label(p)}
                                            active={pronouns === p}
                                            onPress={() => setPronouns(p)}
                                            accent={accent}
                                            colors={null}
                                        />
                                    ))}
                                </View>

                                <SectionLabel text="Bio" />
                                <TextInput
                                    style={styles.textarea}
                                    placeholder="Tell people about yourself..."
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={bio}
                                    onChangeText={setBio}
                                    multiline
                                    numberOfLines={4}
                                    maxLength={300}
                                    textAlignVertical="top"
                                />
                                <Text style={styles.charCount}>{bio.length}/300</Text>
                            </View>
                        )}

                        {/* ─── Step 2: Looking For ─── */}
                        {step === 1 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    Help us find your best matches 💕
                                </Text>

                                <SectionLabel text="I'm looking for" />
                                <View style={styles.chipRow}>
                                    {(INTENTION_OPTIONS).map((opt) => (
                                        <Chip
                                            key={opt.value}
                                            text={opt.label}
                                            active={intention === opt.value}
                                            onPress={() => setIntention(opt.value)}
                                            accent={accent}
                                            colors={null}
                                        />
                                    ))}
                                </View>

                                <SectionLabel text="Interested in" />
                                <Text style={styles.hint}>Select all that apply</Text>
                                <View style={styles.chipRow}>
                                    {(["MALE", "FEMALE", "NON_BINARY", "OTHER"] as GenderOption[]).map((g) => (
                                        <Chip
                                            key={g}
                                            text={label(g)}
                                            active={interestedIn.includes(g)}
                                            onPress={() => toggleGender(g)}
                                            accent={accent}
                                            colors={null}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ─── Step 3: Languages ─── */}
                        {step === 2 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    What languages do you speak? 🗣️
                                </Text>
                                <Text style={styles.hint}>Select all that apply</Text>
                                <View style={styles.chipRow}>
                                    {allLanguages.map((lang) => (
                                        <Chip
                                            key={lang.id}
                                            text={lang.name}
                                            active={selectedLanguageIds.includes(lang.id)}
                                            onPress={() => toggleLanguage(lang.id)}
                                            accent={accent}
                                            colors={null}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ─── Step 3: Interests & Hobbies ─── */}
                        {step === 3 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    What are you into? 🎯
                                </Text>
                                <Text style={styles.hint}>Select all that apply</Text>
                                <View style={styles.chipRow}>
                                    {allInterests.map((interest) => (
                                        <Chip
                                            key={interest.id}
                                            text={interest.name}
                                            active={selectedInterestIds.includes(interest.id)}
                                            onPress={() => toggleInterest(interest.id)}
                                            accent={accent}
                                            colors={null}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ─── Step 4: Personality Traits ─── */}
                        {step === 4 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    How would you describe yourself? 🧠
                                </Text>
                                <Text style={styles.hint}>Pick up to 5 traits</Text>
                                <View style={styles.chipRow}>
                                    {allTraits.map((trait) => (
                                        <Chip
                                            key={trait.id}
                                            text={trait.name}
                                            active={selectedTraitIds.includes(trait.id)}
                                            onPress={() => {
                                                if (selectedTraitIds.includes(trait.id)) {
                                                    toggleTrait(trait.id);
                                                } else if (selectedTraitIds.length < 5) {
                                                    toggleTrait(trait.id);
                                                }
                                            }}
                                            accent={accent}
                                            colors={null}
                                        />
                                    ))}
                                </View>
                                {selectedTraitIds.length >= 5 && (
                                    <Text style={styles.hint}>⚠️ Maximum 5 traits selected</Text>
                                )}
                            </View>
                        )}

                        {/* ─── Step 5: Lifestyle ─── */}
                        {step === 5 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    Share your lifestyle habits 🌿
                                </Text>

                                <SectionLabel text="Smoking" />
                                <View style={styles.chipRow}>
                                    {(["NON_SMOKER", "OCCASIONALLY", "SMOKER"] as Smoking[]).map((s) => (
                                        <Chip key={s} text={label(s)} active={smoking === s} onPress={() => setSmoking(s)} accent={accent} colors={null} />
                                    ))}
                                </View>

                                <SectionLabel text="Drinking" />
                                <View style={styles.chipRow}>
                                    {(["NEVER", "SOCIALLY", "REGULARLY"] as Drinking[]).map((d) => (
                                        <Chip key={d} text={label(d)} active={drinking === d} onPress={() => setDrinking(d)} accent={accent} colors={null} />
                                    ))}
                                </View>

                                <SectionLabel text="Fitness level" />
                                <View style={styles.chipRow}>
                                    {(["VERY_ACTIVE", "MODERATELY_ACTIVE", "NOT_ACTIVE"] as FitnessLevel[]).map((f) => (
                                        <Chip key={f} text={label(f)} active={fitnessLevel === f} onPress={() => setFitnessLevel(f)} accent={accent} colors={null} />
                                    ))}
                                </View>

                                <SectionLabel text="Do you have children?" />
                                <View style={styles.chipRow}>
                                    {(["YES", "NO"] as HasChildren[]).map((h) => (
                                        <Chip key={h} text={label(h)} active={hasChildren === h} onPress={() => setHasChildren(h)} accent={accent} colors={null} />
                                    ))}
                                </View>

                                <SectionLabel text="Do you want children?" />
                                <View style={styles.chipRow}>
                                    {(["WANT", "DONT_WANT", "NOT_SURE"] as WantsChildren[]).map((w) => (
                                        <Chip key={w} text={label(w)} active={wantsChildren === w} onPress={() => setWantsChildren(w)} accent={accent} colors={null} />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ─── Step 6: Background ─── */}
                        {step === 6 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    Tell us a bit more about yourself 🎓
                                </Text>

                                <SectionLabel text="Education level" />
                                <View style={styles.chipRow}>
                                    {(["HIGH_SCHOOL", "COLLEGE", "BACHELORS", "MASTERS", "PHD"] as EducationLevel[]).map((e) => (
                                        <Chip key={e} text={label(e)} active={education === e} onPress={() => setEducation(e)} accent={accent} colors={null} />
                                    ))}
                                </View>

                                <SectionLabel text="Occupation" />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="e.g. Software Engineer"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={occupation}
                                    onChangeText={setOccupation}
                                    maxLength={100}
                                />

                                <SectionLabel text="Industry" />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="e.g. Technology"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={industry}
                                    onChangeText={setIndustry}
                                    maxLength={100}
                                />

                                <SectionLabel text="Ethnicity / Cultural background (optional)" />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="e.g. East African, Latino, Asian..."
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={ethnicity}
                                    onChangeText={setEthnicity}
                                    maxLength={100}
                                    autoCapitalize="words"
                                />
                            </View>
                        )}

                        {/* ─── Step 7: Location ─── */}
                        {step === 7 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    Where are you based? 📍
                                </Text>

                                <SectionLabel text="Country" />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="e.g. Kenya"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={country}
                                    onChangeText={setCountry}
                                    maxLength={100}
                                    autoCapitalize="words"
                                />

                                <SectionLabel text="City" />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="e.g. Nairobi"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={city}
                                    onChangeText={setCity}
                                    maxLength={100}
                                    autoCapitalize="words"
                                />

                                <Text style={styles.hint}>
                                    🔒 Your exact location is never shown publicly. Only your city is visible to other users.
                                </Text>
                            </View>
                        )}

                        {/* ─── Step 8: Discovery Preferences ─── */}
                        {step === 8 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    Who do you want to discover? 🔍
                                </Text>

                                <SectionLabel text="Age range" />
                                <View style={styles.ageRow}>
                                    <View style={styles.ageInputWrapper}>
                                        <Text style={styles.ageLabel}>Min age</Text>
                                        <View style={styles.ageStepper}>
                                            <Pressable
                                                style={styles.stepperBtn}
                                                onPress={() => setMinAge((v) => String(Math.max(18, Number(v) - 1)))}
                                            >
                                                <Ionicons name="remove" size={20} color="#fff" />
                                            </Pressable>
                                            <Text style={styles.ageValue}>{minAge}</Text>
                                            <Pressable
                                                style={styles.stepperBtn}
                                                onPress={() => setMinAge((v) => String(Math.min(Number(maxAge) - 1, Number(v) + 1)))}
                                            >
                                                <Ionicons name="add" size={20} color="#fff" />
                                            </Pressable>
                                        </View>
                                    </View>

                                    <Text style={styles.ageDash}>—</Text>

                                    <View style={styles.ageInputWrapper}>
                                        <Text style={styles.ageLabel}>Max age</Text>
                                        <View style={styles.ageStepper}>
                                            <Pressable
                                                style={styles.stepperBtn}
                                                onPress={() => setMaxAge((v) => String(Math.max(Number(minAge) + 1, Number(v) - 1)))}
                                            >
                                                <Ionicons name="remove" size={20} color="#fff" />
                                            </Pressable>
                                            <Text style={styles.ageValue}>{maxAge}</Text>
                                            <Pressable
                                                style={styles.stepperBtn}
                                                onPress={() => setMaxAge((v) => String(Math.min(100, Number(v) + 1)))}
                                            >
                                                <Ionicons name="add" size={20} color="#fff" />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>

                                <SectionLabel text="Maximum distance" />
                                <View style={styles.chipRow}>
                                    {(["KM_10", "KM_50", "KM_100", "GLOBAL"] as DistancePreference[]).map((d) => (
                                        <Chip
                                            key={d}
                                            text={DISTANCE_LABELS[d]}
                                            active={distancePref === d}
                                            onPress={() => setDistancePref(d)}
                                            accent={accent}
                                            colors={null}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ─── CTA ─── */}
                        <View style={styles.ctaContainer}>
                            {step < TOTAL_STEPS - 1 ? (
                                <Pressable style={[styles.nextBtn, { backgroundColor: accent }]} onPress={goNext}>
                                    <Text style={styles.nextBtnText}>Continue</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
                                </Pressable>
                            ) : (
                                <Pressable
                                    style={[styles.nextBtn, { backgroundColor: accent, opacity: isSaving ? 0.7 : 1 }]}
                                    onPress={handleFinish}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.nextBtnText}>Finish Setup</Text>
                                            <Ionicons name="checkmark" size={18} color="#fff" style={{ marginLeft: 6 }} />
                                        </>
                                    )}
                                </Pressable>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Toast />
        </LinearGradient>
    );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEP_TITLES = [
    "About You",
    "Looking For",
    "Languages",
    "Interests",
    "Personality",
    "Your Lifestyle",
    "Background",
    "Location",
    "Discovery",
];

const INTENTION_OPTIONS: { value: RelationshipIntention; label: string }[] = [
    { value: "MARRIAGE", label: "Marriage" },
    { value: "LONG_TERM", label: "Long-term" },
    { value: "LONG_TERM_OPEN_SHORT", label: "Long-term, open to short" },
    { value: "SHORT_TERM_OPEN_LONG", label: "Short-term, open to long" },
    { value: "CASUAL", label: "Casual dating" },
    { value: "FRIENDSHIP", label: "Friendship" },
    { value: "FIGURING_OUT", label: "Still figuring it out" },
];

const DISTANCE_LABELS: Record<DistancePreference, string> = {
    KM_10: "Within 10 km",
    KM_50: "Within 50 km",
    KM_100: "Within 100 km",
    GLOBAL: "Global",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    gradient: { flex: 1 },
    progressContainer: {
        flexDirection: "row",
        gap: 4,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 4,
    },
    progressDot: {
        height: 4,
        borderRadius: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
    skipText: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 14,
        fontWeight: "500",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    stepContainer: {
        gap: 0,
    },
    stepSubtitle: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
        marginBottom: 24,
        lineHeight: 20,
    },
    sectionLabel: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        marginBottom: 10,
        marginTop: 20,
    },
    hint: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
        marginTop: -6,
        marginBottom: 8,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 4,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
    },
    chipText: {
        fontSize: 13,
        fontWeight: "500",
    },
    textarea: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: 14,
        color: "#fff",
        fontSize: 15,
        minHeight: 100,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        lineHeight: 22,
    },
    charCount: {
        color: "rgba(255,255,255,0.35)",
        fontSize: 11,
        textAlign: "right",
        marginTop: 4,
    },
    textInput: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "#fff",
        fontSize: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        marginBottom: 4,
    },
    ageRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 8,
    },
    ageInputWrapper: {
        flex: 1,
        alignItems: "center",
        gap: 8,
    },
    ageLabel: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontWeight: "600",
    },
    ageStepper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
    },
    stepperBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    ageValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        minWidth: 40,
        textAlign: "center",
    },
    ageDash: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 22,
        marginTop: 20,
    },
    ctaContainer: {
        marginTop: 36,
        marginBottom: 20,
    },
    nextBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        paddingVertical: 16,
        gap: 4,
    },
    nextBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});
