import React, { useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, Pressable, FlatList,
  KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, StatusBar
} from "react-native";

const API_URL = "COLLE_ICI_URL_DU_WORKER"; // URL du Worker NOXIZ, sans /chat
type Message = { role: "user" | "assistant"; content: string };
const RED = "#ff334f";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(text = draft) {
    const content = text.trim();
    if (!content || busy) return;
    if (API_URL === "COLLE_ICI_URL_DU_WORKER") {
      setMessages(old => [...old,
        { role: "user", content },
        { role: "assistant", content: "Le site et l'application NOXIZ sont prêts côté interface, mais le cerveau n'est pas encore connecté. Configure l'URL de ton Worker dans App.tsx." }
      ]);
      setDraft("");
      return;
    }
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setBusy(true);
    try {
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur du service IA");
      setMessages(old => [...old, { role: "assistant", content: data.reply || "Je n'ai pas reçu de réponse." }]);
    } catch {
      setMessages(old => [...old, { role: "assistant", content: "Je n'arrive pas à joindre le cerveau de NOXIZ. Vérifie la connexion et réessaie." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0b090b" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <View style={styles.logo}><Text style={styles.logoText}>N</Text></View>
          <View style={styles.flex}>
            <Text style={styles.brand}>NOXIZ</Text>
            <Text style={styles.caption}>ASSISTANT IA</Text>
          </View>
          <View style={styles.online}><View style={styles.dot}/><Text style={styles.onlineText}>IA</Text></View>
        </View>
        {messages.length === 0 ? (
          <View style={styles.welcome}>
            <View style={styles.bigLogo}><Text style={styles.bigLogoText}>N</Text></View>
            <Text style={styles.eyebrow}>TON IA · TON UNIVERS</Text>
            <Text style={styles.title}>Salut, je suis <Text style={{color:RED}}>NOXIZ.</Text></Text>
            <Text style={styles.description}>Pose une question, explore une idée ou demande de l'aide.</Text>
            <View style={styles.suggestions}>
              {[
                ["✦ Comprendre l'IA", "Explique-moi simplement comment fonctionne une intelligence artificielle."],
                ["⌘ Organiser un projet", "Aide-moi à créer un projet étape par étape."],
                ["◇ Trouver des idées", "Donne-moi trois idées originales pour apprendre quelque chose."],
                ["↗ Découvrir un sujet", "Apprends-moi un fait scientifique intéressant."]
              ].map(([label, prompt]) => (
                <Pressable key={label} style={styles.suggestion} onPress={() => send(prompt)}>
                  <Text style={styles.suggestionText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.messageList}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={({item}) => (
              <View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.aiBubble]}>
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}
          />
        )}
        {busy && <View style={styles.loading}><ActivityIndicator color={RED}/><Text style={styles.loadingText}>NOXIZ réfléchit…</Text></View>}
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Écris ton message…"
            placeholderTextColor="#8b7880"
            multiline
            style={styles.input}
            onSubmitEditing={() => send()}
            blurOnSubmit={false}
          />
          <Pressable style={[styles.send, (!draft.trim() || busy) && styles.sendDisabled]} disabled={!draft.trim() || busy} onPress={() => send()}>
            <Text style={styles.sendText}>↑</Text>
          </Pressable>
        </View>
        <Text style={styles.disclaimer}>NOXIZ peut se tromper. Vérifie les informations importantes.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b090b" },
  flex: { flex: 1 },
  header: { height: 68, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: "#38202a", gap: 12 },
  logo: { width: 42, height: 42, borderRadius: 13, backgroundColor: RED, alignItems: "center", justifyContent: "center" },
  logoText: { color: "white", fontSize: 23, fontWeight: "900" },
  brand: { color: "#f7f0f2", fontSize: 17, fontWeight: "900", letterSpacing: 3 },
  caption: { color: "#b09da4", fontSize: 9, letterSpacing: 2, marginTop: 3 },
  online: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "#48202b", paddingVertical: 7, paddingHorizontal: 10, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: RED },
  onlineText: { color: "#e0cdd3", fontSize: 11 },
  welcome: { flex: 1, justifyContent: "center", paddingHorizontal: 22, paddingBottom: 16 },
  bigLogo: { alignSelf: "center", width: 70, height: 70, borderRadius: 22, backgroundColor: RED, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  bigLogoText: { color: "white", fontSize: 36, fontWeight: "900" },
  eyebrow: { color: RED, textAlign: "center", fontSize: 10, fontWeight: "800", letterSpacing: 3 },
  title: { color: "#f7f0f2", textAlign: "center", fontSize: 30, fontWeight: "800", marginTop: 12 },
  description: { color: "#b09da4", textAlign: "center", lineHeight: 22, marginTop: 12, marginBottom: 20 },
  suggestions: { gap: 9 },
  suggestion: { backgroundColor: "#171116", borderWidth: 1, borderColor: "#48202b", borderRadius: 12, padding: 13 },
  suggestionText: { color: "#f2e6ea", fontWeight: "600" },
  list: { flex: 1 },
  messageList: { padding: 16, gap: 12 },
  bubble: { padding: 13, borderRadius: 14, maxWidth: "90%" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#551326", borderWidth: 1, borderColor: "#8e2942" },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#171116", borderWidth: 1, borderColor: "#48202b" },
  messageText: { color: "#f7f0f2", fontSize: 15, lineHeight: 22 },
  loading: { flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 20, paddingVertical: 8 },
  loadingText: { color: "#b09da4", fontSize: 12 },
  composer: { flexDirection: "row", alignItems: "flex-end", margin: 12, marginBottom: 4, padding: 8, borderWidth: 1, borderColor: "#67303c", borderRadius: 16, backgroundColor: "#151015", gap: 8 },
  input: { flex: 1, color: "#f7f0f2", maxHeight: 130, minHeight: 42, paddingHorizontal: 8, paddingTop: 10, fontSize: 15 },
  send: { backgroundColor: RED, width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sendDisabled: { opacity: 0.45 },
  sendText: { color: "white", fontSize: 24, fontWeight: "900" },
  disclaimer: { color: "#7e6a72", textAlign: "center", fontSize: 10, paddingHorizontal: 10, paddingBottom: 7 }
});
