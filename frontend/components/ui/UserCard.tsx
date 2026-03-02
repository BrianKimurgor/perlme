import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

interface UserCardProps {
    userId: string;
    username: string;
    bio?: string | null;
    avatarUrl?: string | null;
    followersCount?: number;
    postsCount?: number;
    onPress: () => void;
    onFollow?: () => void;
    isFollowing?: boolean;
    showFollowButton?: boolean;
    style?: ViewStyle;
}

export const UserCard: React.FC<UserCardProps> = ({
    username,
    bio,
    avatarUrl,
    followersCount,
    postsCount,
    onPress,
    onFollow,
    isFollowing = false,
    showFollowButton = true,
    style,
}) => {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <Avatar uri={avatarUrl} name={username} size={60} />
            <View style={styles.info}>
                <Text style={styles.username}>{username}</Text>
                {bio && <Text style={styles.bio} numberOfLines={2}>{bio}</Text>}
                <View style={styles.stats}>
                    {postsCount !== undefined && (
                        <Text style={styles.statText}>{postsCount} posts</Text>
                    )}
                    {followersCount !== undefined && (
                        <>
                            <Text style={styles.separator}>•</Text>
                            <Text style={styles.statText}>{followersCount} followers</Text>
                        </>
                    )}
                </View>
            </View>
            {showFollowButton && onFollow && (
                <Button
                    title={isFollowing ? "Following" : "Follow"}
                    onPress={onFollow}
                    variant={isFollowing ? "outline" : "primary"}
                    size="small"
                    style={styles.followButton}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    info: {
        flex: 1,
        marginLeft: 16,
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 4,
    },
    bio: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 6,
    },
    stats: {
        flexDirection: "row",
        alignItems: "center",
    },
    statText: {
        fontSize: 12,
        color: "#9ca3af",
    },
    separator: {
        marginHorizontal: 8,
        color: "#9ca3af",
    },
    followButton: {
        minWidth: 90,
    },
});
