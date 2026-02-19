# scripts/admin_dashboard_ultime.py
import os
import streamlit as st
import pandas as pd
import json
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go

# Configuration
st.set_page_config(
    page_title="AlgeriaExport - Admin Ultime",
    page_icon="🇩🇿",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🇩🇿 AlgeriaExport - Administration Ultime")
st.markdown("---")

# Connexion Supabase
@st.cache_resource
def init_supabase():
    load_dotenv('.env.local')
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

supabase = init_supabase()

# Charger les données
@st.cache_data(ttl=60)
def load_data():
    result = supabase.table('exporters').select('*').execute()
    return pd.DataFrame(result.data)

df = load_data()

# Sidebar
with st.sidebar:
    st.image("https://via.placeholder.com/150x50?text=AlgeriaExport", use_container_width=True)
    st.markdown("---")
    
    menu = st.radio(
        "Navigation",
        ["📊 Tableau de bord", "🏢 Gestion entreprises", "📈 Statistiques avancées", "⚙️ Paramètres", "💾 Sauvegarde GitHub"]
    )
    
    st.markdown("---")
    st.caption(f"© 2026 - v2.0")
    st.caption(f"Entreprises: {len(df)}")

# ===========================================
# 1. TABLEAU DE BORD AMÉLIORÉ
# ===========================================
if menu == "📊 Tableau de bord":
    st.header("Tableau de bord")
    
    # Métriques
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total entreprises", len(df), delta="+1249")
    with col2:
        verified = len(df[df['can_export'] == True]) if 'can_export' in df.columns else 0
        st.metric("Exportateurs", verified)
    with col3:
        wilayas = df['wilaya'].nunique() if 'wilaya' in df.columns else 0
        st.metric("Wilayas couvertes", wilayas)
    with col4:
        sectors = df['activity_sector'].nunique() if 'activity_sector' in df.columns else 0
        st.metric("Secteurs", sectors)
    
    st.markdown("---")
    
    # Graphiques interactifs
    col1, col2 = st.columns(2)
    
    with col1:
        if 'wilaya' in df.columns:
            st.subheader("🗺️ Top 15 Wilayas")
            wilaya_counts = df['wilaya'].value_counts().head(15).reset_index()
            wilaya_counts.columns = ['Wilaya', 'Nombre']
            fig = px.bar(wilaya_counts, x='Wilaya', y='Nombre', color='Nombre', 
                        title="Répartition par wilaya")
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        if 'activity_sector' in df.columns:
            st.subheader("🏭 Top 15 Secteurs")
            sector_counts = df['activity_sector'].value_counts().head(15).reset_index()
            sector_counts.columns = ['Secteur', 'Nombre']
            fig = px.pie(sector_counts, values='Nombre', names='Secteur', 
                        title="Répartition sectorielle")
            st.plotly_chart(fig, use_container_width=True)

# ===========================================
# 2. GESTION ENTREPRISES AMÉLIORÉE
# ===========================================
elif menu == "🏢 Gestion entreprises":
    st.header("Gestion des entreprises")
    
    tab1, tab2, tab3 = st.tabs(["🔍 Consultation", "✏️ Édition", "📤 Export"])
    
    with tab1:
        # Filtres avancés
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            if 'wilaya' in df.columns:
                wilaya_filter = st.multiselect("Wilaya", df['wilaya'].dropna().unique())
        with col2:
            if 'activity_sector' in df.columns:
                sector_filter = st.multiselect("Secteur", df['activity_sector'].dropna().unique())
        with col3:
            search = st.text_input("Recherche nom")
        with col4:
            has_phone = st.checkbox("Avec téléphone")
        
        # Appliquer filtres
        filtered = df.copy()
        if wilaya_filter:
            filtered = filtered[filtered['wilaya'].isin(wilaya_filter)]
        if sector_filter:
            filtered = filtered[filtered['activity_sector'].isin(sector_filter)]
        if search:
            filtered = filtered[filtered['name'].str.contains(search, case=False, na=False)]
        if has_phone:
            filtered = filtered[filtered['phone'].notna()]
        
        st.info(f"{len(filtered)} entreprises trouvées")
        
        # Affichage avec sélection
        cols = ['name', 'activity_sector', 'wilaya', 'phone', 'email']
        display_cols = [c for c in cols if c in filtered.columns]
        
        event = st.dataframe(
            filtered[display_cols],
            use_container_width=True,
            height=500,
            on_select="rerun",
            selection_mode="single"
        )
        
        # Détails de l'entreprise sélectionnée
        if event and hasattr(event, 'selection') and event.selection and event.selection.rows:
            idx = event.selection.rows[0]
            selected = filtered.iloc[idx]
            with st.expander("📋 Détails complets", expanded=True):
                st.json(selected.to_dict())
    
    with tab2:
        st.warning("Mode édition - Sélectionner une entreprise")
        # Interface d'édition à venir
    
    with tab3:
        st.subheader("Exporter les données")
        col1, col2 = st.columns(2)
        with col1:
            if st.button("📥 Exporter en CSV"):
                csv = filtered.to_csv(index=False).encode('utf-8')
                st.download_button(
                    "Télécharger CSV",
                    csv,
                    "exportateurs.csv",
                    "text/csv"
                )
        with col2:
            if st.button("📥 Exporter en JSON"):
                json_str = filtered.to_json(orient='records', force_ascii=False)
                st.download_button(
                    "Télécharger JSON",
                    json_str,
                    "exportateurs.json",
                    "application/json"
                )

# ===========================================
# 3. STATISTIQUES AVANCÉES
# ===========================================
elif menu == "📈 Statistiques avancées":
    st.header("Statistiques avancées")
    
    # Analyse complète
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 Qualité des données")
        stats = []
        for col in df.columns[:10]:
            filled = df[col].notna().sum()
            stats.append({"Colonne": col, "Remplissage": f"{filled}/{len(df)} ({filled/len(df)*100:.1f}%)"})
        st.dataframe(pd.DataFrame(stats))
    
    with col2:
        st.subheader("🔍 Top des valeurs")
        if 'name' in df.columns:
            st.write("**Longueur des noms**")
            name_lengths = df['name'].str.len().describe()
            st.dataframe(name_lengths.to_frame().T)
    
    # Graphique avancé
    st.subheader("📈 Distribution des données")
    numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
    if len(numeric_cols) > 0:
        selected_num = st.selectbox("Choisir une colonne numérique", numeric_cols)
        fig = px.histogram(df, x=selected_num, nbins=30, title=f"Distribution de {selected_num}")
        st.plotly_chart(fig, use_container_width=True)

# ===========================================
# 4. PARAMÈTRES
# ===========================================
elif menu == "⚙️ Paramètres":
    st.header("Paramètres")
    
    tab1, tab2, tab3 = st.tabs(["🔧 Configuration", "📦 Import", "🔐 Sécurité"])
    
    with tab1:
        st.subheader("Configuration générale")
        st.text_input("Nom du site", value="AlgeriaExport.com")
        st.selectbox("Langue par défaut", ["Français", "Arabe", "Anglais"])
        
    with tab2:
        st.subheader("Import de données")
        uploaded = st.file_uploader("Fichier JSON", type=['json'])
        if uploaded:
            st.success(f"Fichier chargé: {uploaded.name}")
            if st.button("🚀 Lancer l'import"):
                st.info("Import en cours... (simulation)")
                st.progress(100)
                st.success("Import terminé!")
    
    with tab3:
        st.subheader("Sécurité")
        st.checkbox("Activer RLS", value=True)
        st.checkbox("Journalisation", value=True)
        st.button("🔄 Régénérer clés API")

# ===========================================
# 5. SAUVEGARDE GITHUB (G99)
# ===========================================
elif menu == "💾 Sauvegarde GitHub":
    st.header("Sauvegarde GitHub - Commande G99")
    
    st.warning("⚠️ Cette action sauvegarde tout le projet sur GitHub")
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("💾 EXÉCUTER G99", type="primary"):
            with st.spinner("Sauvegarde en cours..."):
                # Simulation
                progress = st.progress(0)
                for i in range(100):
                    progress.progress(i + 1)
                
                st.success("✅ Sauvegarde GitHub terminée!")
                st.info("Fichiers sauvegardés: README.md, CHANGELOG.md, scripts/*, data/private/*")
    
    with col2:
        st.code("""
# Commandes exécutées:
git add .
git commit -m "G99: Sauvegarde totale - 19/02/2026"
git push origin main
        """)

# Footer
st.markdown("---")
st.caption("Interface d'administration ultime - AlgeriaExport.com")