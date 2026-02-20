# scripts/admin_dashboard.py
import os
import streamlit as st
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

# Configuration de la page
st.set_page_config(
    page_title="AlgeriaExport - Admin",
    page_icon="🇩🇿",
    layout="wide"
)

# Titre
st.title("🇩🇿 AlgeriaExport - Interface Admin")
st.markdown("---")

# Connexion Supabase
@st.cache_resource
def init_supabase():
    load_dotenv('.env.local')
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

supabase = init_supabase()

# Sidebar - Navigation
st.sidebar.title("Navigation")
page = st.sidebar.radio(
    "Aller à",
    ["📊 Tableau de bord", "🏢 Entreprises", "📈 Statistiques", "⚙️ Paramètres"]
)

# Charger les données
@st.cache_data(ttl=300)
def load_exporters():
    result = supabase.table('exporters').select('*').execute()
    return pd.DataFrame(result.data)

df = load_exporters()

if page == "📊 Tableau de bord":
    st.header("Tableau de bord")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total entreprises", len(df))
    with col2:
        verified = len(df[df['can_export'] == True]) if 'can_export' in df.columns else 0
        st.metric("Exportateurs", verified)
    with col3:
        wilayas = df['wilaya'].nunique() if 'wilaya' in df.columns else 0
        st.metric("Wilayas", wilayas)
    with col4:
        sectors = df['activity_sector'].nunique() if 'activity_sector' in df.columns else 0
        st.metric("Secteurs", sectors)
    
    st.markdown("---")
    
    # Graphiques
    col1, col2 = st.columns(2)
    
    with col1:
        if 'wilaya' in df.columns:
            st.subheader("Top 10 Wilayas")
            top_wilayas = df['wilaya'].value_counts().head(10)
            st.bar_chart(top_wilayas)
    
    with col2:
        if 'activity_sector' in df.columns:
            st.subheader("Top 10 Secteurs")
            top_sectors = df['activity_sector'].value_counts().head(10)
            st.bar_chart(top_sectors)

elif page == "🏢 Entreprises":
    st.header("Gestion des entreprises")
    
    # Filtres
    col1, col2, col3 = st.columns(3)
    with col1:
        if 'wilaya' in df.columns:
            wilaya_filter = st.multiselect("Filtrer par wilaya", df['wilaya'].dropna().unique())
    with col2:
        if 'activity_sector' in df.columns:
            sector_filter = st.multiselect("Filtrer par secteur", df['activity_sector'].dropna().unique())
    with col3:
        search = st.text_input("Rechercher par nom")
    
    # Appliquer les filtres
    filtered_df = df.copy()
    if wilaya_filter:
        filtered_df = filtered_df[filtered_df['wilaya'].isin(wilaya_filter)]
    if sector_filter:
        filtered_df = filtered_df[filtered_df['activity_sector'].isin(sector_filter)]
    if search:
        filtered_df = filtered_df[filtered_df['name'].str.contains(search, case=False, na=False)]
    
    st.write(f"Affichage {len(filtered_df)} entreprises")
    
    # Afficher les données
    st.dataframe(
        filtered_df[['name', 'activity_sector', 'wilaya', 'phone', 'email']],
        use_container_width=True,
        height=500
    )

elif page == "📈 Statistiques":
    st.header("Statistiques détaillées")
    
    # Statistiques générales
    st.subheader("Vue d'ensemble")
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**Répartition par wilaya**")
        wilaya_stats = df['wilaya'].value_counts()
        st.dataframe(wilaya_stats)
    
    with col2:
        st.write("**Répartition par secteur**")
        sector_stats = df['activity_sector'].value_counts()
        st.dataframe(sector_stats)

elif page == "⚙️ Paramètres":
    st.header("Paramètres")
    
    st.subheader("Import de données")
    uploaded_file = st.file_uploader("Choisir un fichier JSON", type=['json'])
    
    if uploaded_file:
        st.success(f"Fichier chargé: {uploaded_file.name}")
        if st.button("Importer"):
            st.info("Import en cours... (à implémenter)")

# Footer
st.markdown("---")
st.markdown("© 2026 AlgeriaExport.com - Interface Admin")