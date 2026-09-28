/**
 * SymbolIntegrationEngine Service
 * 
 * Defines the SymbolRegistry interface, visual hierarchy models, and data structures
 * for handling symbol metadata, visual translation, integration relationships,
 * and deconstruction maps. Re-exports and integrates with the core engine
 * in src/utils/symbolIntegrationEngine.ts.
 */

import {
  SymbolRegistryItem,
  SymbolVisualTranslation,
  SymbolIntegrationLink,
  IntegratedDesignGeometry,
  SymbolLocationMapItem,
  SymbolMapDeconstruction,
  SymbolTraceabilityItem,
  SymbolIntegrationValidation,
  SymbolicIntegrationModelResult,
  SymbolPriority,
  SymbolSourceType,
  IntegrationType,
  PersonData,
  NumerologyProfile,
  AstrologyProfile,
  EnneagramProfile,
  SymbolismProfile,
  ChakraProfile,
  TattooDesignParameters
} from '../types';

import {
  executeSymbolicIntegrationEngine
} from '../utils/symbolIntegrationEngine';

/**
 * SymbolRegistry interface manages the collection of registered symbolic elements
 * derived from personal analysis calculations.
 */
export interface SymbolRegistry {
  items: SymbolRegistryItem[];
  getById(symbolId: string): SymbolRegistryItem | undefined;
  getByCategory(category: string): SymbolRegistryItem[];
  getByPriority(priority: SymbolPriority): SymbolRegistryItem[];
  getRequiredSymbols(): SymbolRegistryItem[];
  addSymbol(item: SymbolRegistryItem): void;
  removeSymbol(symbolId: string): void;
}

/**
 * Visual Hierarchy configuration for the composite tattoo structure
 */
export interface SymbolVisualHierarchy {
  focalElement: SymbolRegistryItem | null;
  secondaryElements: SymbolRegistryItem[];
  accentElements: SymbolRegistryItem[];
  microElements: SymbolRegistryItem[];
  negativeSpaceAnchors: string[];
}

/**
 * Input parameters for building a comprehensive personal symbolic profile
 */
export interface SymbolicIntegrationInput {
  person: PersonData;
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  enneagram: EnneagramProfile;
  symbolism: SymbolismProfile;
  chakra?: ChakraProfile;
  designParameters: TattooDesignParameters;
}

/**
 * Class implementation of the Symbol Registry
 */
export class ConcreteSymbolRegistry implements SymbolRegistry {
  public items: SymbolRegistryItem[] = [];

  constructor(initialItems: SymbolRegistryItem[] = []) {
    this.items = [...initialItems];
  }

  getById(symbolId: string): SymbolRegistryItem | undefined {
    return this.items.find(item => item.symbolId === symbolId);
  }

  getByCategory(category: string): SymbolRegistryItem[] {
    return this.items.filter(item => 
      item.symbolCategory.toLowerCase() === category.toLowerCase() ||
      (item.sourceCategory && item.sourceCategory.toLowerCase() === category.toLowerCase())
    );
  }

  getByPriority(priority: SymbolPriority): SymbolRegistryItem[] {
    return this.items.filter(item => item.priority === priority);
  }

  getRequiredSymbols(): SymbolRegistryItem[] {
    return this.items.filter(item => item.required);
  }

  addSymbol(item: SymbolRegistryItem): void {
    const existingIndex = this.items.findIndex(i => i.symbolId === item.symbolId);
    if (existingIndex >= 0) {
      this.items[existingIndex] = item;
    } else {
      this.items.push(item);
    }
  }

  removeSymbol(symbolId: string): void {
    this.items = this.items.filter(item => item.symbolId !== symbolId);
  }
}

/**
 * Service orchestrator for Symbolic Integration
 */
export class SymbolIntegrationService {
  /**
   * Executes the full pipeline to integrate disparate personal symbols into
   * a single cohesive tattoo composition and detailed deconstruction map.
   */
  public static integrate(input: SymbolicIntegrationInput): SymbolicIntegrationModelResult {
    return executeSymbolicIntegrationEngine(input);
  }

  /**
   * Builds an active SymbolRegistry instance from calculation results
   */
  public static createRegistry(input: SymbolicIntegrationInput): SymbolRegistry {
    const result = executeSymbolicIntegrationEngine(input);
    return new ConcreteSymbolRegistry(result.symbols);
  }

  /**
   * Computes the visual hierarchy layers from an integrated model result
   */
  public static extractVisualHierarchy(result: SymbolicIntegrationModelResult): SymbolVisualHierarchy {
    const focal = result.symbols.find(s => s.priority === 'PRIMARY') || result.symbols[0] || null;
    const secondary = result.symbols.filter(s => s.priority === 'SECONDARY');
    const accents = result.symbols.filter(s => s.priority === 'ACCENT');
    const micro = result.symbols.filter(s => s.priority === 'SUBTLE_FILL');

    return {
      focalElement: focal,
      secondaryElements: secondary,
      accentElements: accents,
      microElements: micro,
      negativeSpaceAnchors: result.integrations
        .filter(i => i.integrationType === 'NEGATIVE_SPACE')
        .map(i => i.negativeSpaceRole)
    };
  }

  /**
   * Exports the complete model to JSON
   */
  public static exportToJson(result: SymbolicIntegrationModelResult): string {
    return JSON.stringify(result, null, 2);
  }
}

// Re-export core types and functions for unified consumption
export type {
  SymbolRegistryItem,
  SymbolVisualTranslation,
  SymbolIntegrationLink,
  IntegratedDesignGeometry,
  SymbolLocationMapItem,
  SymbolMapDeconstruction,
  SymbolTraceabilityItem,
  SymbolIntegrationValidation,
  SymbolicIntegrationModelResult,
  SymbolPriority,
  SymbolSourceType,
  IntegrationType
};

export {
  executeSymbolicIntegrationEngine
};
