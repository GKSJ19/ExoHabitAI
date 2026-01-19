"""
ExoHabitAI - Simple Preprocessing Visualizations
Generates clean, minimal visualizations to demonstrate preprocessing results.

Author: ExoHabitAI Team
Version: 1.0
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import warnings

warnings.filterwarnings('ignore')

# Set clean style
sns.set_style("whitegrid")
plt.rcParams['figure.dpi'] = 100
plt.rcParams['savefig.dpi'] = 300


def load_data():
    """Load preprocessed data."""
    df = pd.read_csv("data/processed/exoplanet_tess_processed.csv")
    print(f"✓ Loaded {len(df):,} exoplanets\n")
    return df


def plot_data_quality(df, output_dir):
    """Show data retention and quality metrics."""
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Data from preprocessing
    stages = ['Raw Data', 'After Cleaning', 'Final Dataset']
    dropped_during_cleaning = 39212 - len(df)
    summary = {
        'initial_rows': 39212,
        'after_cleaning_rows': len(df) + dropped_during_cleaning,
        'final_rows': len(df)
    }
    counts = [
        summary['initial_rows'],
        summary['after_cleaning_rows'],
        summary['final_rows']
    ]

    colors = ['#d62728', '#ff7f0e', '#2ca02c']
    
    bars = ax.bar(stages, counts, color=colors, edgecolor='black', linewidth=2)
    ax.set_ylabel('Number of Exoplanets', fontsize=12, fontweight='bold')
    ax.set_title('Data Quality: Preprocessing Pipeline Results', fontsize=14, fontweight='bold', pad=20)
    ax.grid(axis='y', alpha=0.3)
    
    # Add value labels
    for bar, count in zip(bars, counts):
        height = bar.get_height()
        retention = (count / 39212) * 100
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{count:,}\n({retention:.1f}%)',
                ha='center', va='bottom', fontsize=11, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(output_dir / 'preprocessing_data_quality.png', bbox_inches='tight')
    print("  ✓ Saved: preprocessing_data_quality.png")
    plt.close()


def plot_habitability_distribution(df, output_dir):
    """Show habitability candidate distribution."""
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Habitability counts
    hz_types = ['Conservative\nHZ', 'Standard\nHZ', 'Optimistic\nHZ']
    counts = [
        df['hz_conservative'].sum(),
        df['habitable_candidate'].sum(),
        df['hz_optimistic'].sum()
    ]
    colors = ['#006400', '#2ca02c', '#90EE90']
    
    bars = ax.bar(hz_types, counts, color=colors, edgecolor='black', linewidth=2)
    ax.set_ylabel('Number of Candidates', fontsize=12, fontweight='bold')
    ax.set_title('Habitable Zone Candidates Identified', fontsize=14, fontweight='bold', pad=20)
    ax.grid(axis='y', alpha=0.3)
    
    # Add value labels
    for bar, count in zip(bars, counts):
        height = bar.get_height()
        pct = (count / len(df)) * 100
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{count}\n({pct:.2f}%)',
                ha='center', va='bottom', fontsize=11, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(output_dir / 'preprocessing_habitability_candidates.png', bbox_inches='tight')
    print("  ✓ Saved: preprocessing_habitability_candidates.png")
    plt.close()


def plot_planet_classification(df, output_dir):
    """Show planet type distribution."""
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Planet types
    type_counts = df['pl_type_category'].value_counts()
    type_labels = [t.replace('_', ' ').title() for t in type_counts.index]
    colors = ['#8B4513', '#CD853F', '#4682B4', '#FF6347']
    
    bars = ax.bar(type_labels, type_counts.values, color=colors, 
                  edgecolor='black', linewidth=2)
    ax.set_ylabel('Number of Planets', fontsize=12, fontweight='bold')
    ax.set_title('Planet Classification Results', fontsize=14, fontweight='bold', pad=20)
    ax.grid(axis='y', alpha=0.3)
    
    # Add value labels
    for bar, count in zip(bars, type_counts.values):
        height = bar.get_height()
        pct = (count / len(df)) * 100
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{count:,}\n({pct:.1f}%)',
                ha='center', va='bottom', fontsize=10, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(output_dir / 'preprocessing_planet_types.png', bbox_inches='tight')
    print("  ✓ Saved: preprocessing_planet_types.png")
    plt.close()


def plot_feature_creation(df, output_dir):
    """Show new features created."""
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Feature categories
    categories = [
        'Original\nFeatures',
        'Physical\nFeatures',
        'Categorical\nFeatures',
        'Habitability\nIndices',
        'One-Hot\nEncoded'
    ]
    counts = [14, 4, 2, 5, 9]
    colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
    
    bars = ax.bar(categories, counts, color=colors, edgecolor='black', linewidth=2)
    ax.set_ylabel('Number of Features', fontsize=12, fontweight='bold')
    ax.set_title('Feature Engineering Summary', fontsize=14, fontweight='bold', pad=20)
    ax.grid(axis='y', alpha=0.3)
    ax.set_ylim(0, max(counts) + 3)
    
    # Add value labels
    for bar, count in zip(bars, counts):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{count}',
                ha='center', va='bottom', fontsize=12, fontweight='bold')
    
    # Add total
    total = sum(counts)
    ax.text(0.98, 0.98, f'Total Features: {total}', 
            transform=ax.transAxes, fontsize=12, fontweight='bold',
            verticalalignment='top', horizontalalignment='right',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    plt.tight_layout()
    plt.savefig(output_dir / 'preprocessing_features_created.png', bbox_inches='tight')
    print("  ✓ Saved: preprocessing_features_created.png")
    plt.close()


def plot_missing_values(df, output_dir):
    """Show data completeness."""
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Calculate completeness
    total_cells = len(df) * len(df.columns)
    missing_cells = df.isnull().sum().sum()
    complete_cells = total_cells - missing_cells
    
    sizes = [complete_cells, missing_cells]
    labels = [f'Complete\n{complete_cells:,} values\n({complete_cells/total_cells*100:.2f}%)',
              f'Missing\n{missing_cells} values\n({missing_cells/total_cells*100:.2f}%)']
    colors = ['#2ca02c', '#d62728']
    explode = (0.05, 0)
    
    ax.pie(sizes, labels=labels, colors=colors, autopct='', startangle=90,
           explode=explode, textprops={'fontsize': 11, 'fontweight': 'bold'},
           wedgeprops={'edgecolor': 'black', 'linewidth': 2})
    ax.set_title('Data Completeness After Preprocessing', fontsize=14, fontweight='bold', pad=20)
    
    plt.tight_layout()
    plt.savefig(output_dir / 'preprocessing_data_completeness.png', bbox_inches='tight')
    print("  ✓ Saved: preprocessing_data_completeness.png")
    plt.close()


def print_summary(df):
    """Print visualization summary."""
    print("\n" + "=" * 70)
    print(" " * 20 + "VISUALIZATION SUMMARY")
    print("=" * 70)
    
    print(f"\nDataset: {len(df):,} exoplanets")
    print(f"Features: {len(df.columns)}")
    print(f"Completeness: {(1 - df.isnull().sum().sum()/(len(df)*len(df.columns)))*100:.2f}%")
    
    print(f"\nHabitable Candidates:")
    print(f"  Standard HZ: {df['habitable_candidate'].sum()} ({df['habitable_candidate'].mean()*100:.2f}%)")
    
    print(f"\nTop 3 Candidates by Habitability Score:")
    top3 = df.nlargest(3, 'habitability_score_index')[['pl_name', 'habitability_score_index']]
    for idx, row in top3.iterrows():
        print(f"  • {row['pl_name']:25} - Score: {row['habitability_score_index']:.3f}")


def visualize():
    """Generate all preprocessing visualizations."""
    print("\n" + "=" * 70)
    print(" " * 15 + "PREPROCESSING VISUALIZATIONS")
    print("=" * 70 + "\n")
    
    # Load data
    df = load_data()
    
    # Create output directory
    output_dir = Path("data/visualizations")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate visualizations
    print("Generating visualizations...\n")
    plot_data_quality(df, output_dir)
    plot_habitability_distribution(df, output_dir)
    plot_planet_classification(df, output_dir)
    plot_feature_creation(df, output_dir)
    plot_missing_values(df, output_dir)
    
    # Print summary
    print_summary(df)
    
    print("\n" + "=" * 70)
    print(" " * 20 + "COMPLETE")
    print("=" * 70)
    print(f"\nGenerated 5 visualizations in: {output_dir}/")
    print("\nFiles:")
    print("  1. preprocessing_data_quality.png")
    print("  2. preprocessing_habitability_candidates.png")
    print("  3. preprocessing_planet_types.png")
    print("  4. preprocessing_features_created.png")
    print("  5. preprocessing_data_completeness.png")
    print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    visualize()