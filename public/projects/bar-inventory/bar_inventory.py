#!/usr/bin/env python3
"""
Bar Inventory Management System - Fluidum UG (2019)
A system for managing bar inventory with cocktail creation functionality.
This was the author's first Python script to automate inventory counting.
"""

import json
import os
import argparse
from datetime import datetime
from typing import Dict, List, Optional


class Inventory:
    """Manages the bar inventory with stock tracking and HACCP compliance."""
    
    def __init__(self, inventory_file: str = "bar_inventory.json"):
        self.inventory_file = inventory_file
        self.items: Dict[str, int] = self.load_inventory()
        self.log_file = "inventory_log.txt"
    
    def load_inventory(self) -> Dict[str, int]:
        """Load inventory from file or create default inventory."""
        if os.path.exists(self.inventory_file):
            with open(self.inventory_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # Default inventory
            default_inventory = {
                "vodka": 10,
                "gin": 8,
                "rum": 6,
                "tequila": 5,
                "whiskey": 7,
                "cognac": 4,
                "triple_sec": 3,
                "lime_juice": 5,
                "simple_syrup": 4,
                "tonic_water": 12,
                "soda_water": 10,
                "bitters": 6,
                "lemons": 8,
                "limes": 10,
                "mint": 5,
                "ice": 100  # Assumed unlimited but tracked
            }
            self.save_inventory(default_inventory)
            return default_inventory
    
    def save_inventory(self, inventory: Dict[str, int] = None):
        """Save inventory to file."""
        if inventory is None:
            inventory = self.items
        with open(self.inventory_file, 'w', encoding='utf-8') as f:
            json.dump(inventory, f, indent=2)
    
    def check(self, ingredients: Dict[str, int]) -> bool:
        """Check if sufficient ingredients are available."""
        for ingredient, required_amount in ingredients.items():
            if self.items.get(ingredient, 0) < required_amount:
                return False
        return True
    
    def dispense(self, ingredients: Dict[str, int]):
        """Remove ingredients from inventory after cocktail creation."""
        for ingredient, amount in ingredients.items():
            if ingredient in self.items:
                self.items[ingredient] -= amount
            else:
                print(f"Warning: {ingredient} not found in inventory")
        self.save_inventory()
    
    def add_stock(self, ingredient: str, amount: int):
        """Add stock to inventory."""
        if ingredient in self.items:
            self.items[ingredient] += amount
        else:
            self.items[ingredient] = amount
        self.save_inventory()
    
    def get_stock_level(self, ingredient: str) -> int:
        """Get current stock level of an ingredient."""
        return self.items.get(ingredient, 0)
    
    def list_inventory(self):
        """Display current inventory."""
        print("Current Inventory:")
        print("-" * 20)
        for item, quantity in self.items.items():
            print(f"{item}: {quantity}")


class HACCPManager:
    """Manages HACCP compliance for the bar."""
    
    def __init__(self, haccp_file: str = "haccp_records.json"):
        self.haccp_file = haccp_file
        self.temperature_logs = self.load_records('temperature_logs', [])
        self.cleaning_logs = self.load_records('cleaning_logs', [])
        self.training_records = self.load_records('training_records', [])
    
    def load_records(self, key: str, default_value):
        """Load HACCP records from file."""
        if os.path.exists(self.haccp_file):
            with open(self.haccp_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get(key, default_value)
        return default_value
    
    def save_records(self):
        """Save all HACCP records to file."""
        data = {
            'temperature_logs': self.temperature_logs,
            'cleaning_logs': self.cleaning_logs,
            'training_records': self.training_records
        }
        with open(self.haccp_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    
    def log_temperature(self, area: str, temperature: float):
        """Log temperature for HACCP compliance."""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "area": area,
            "temperature": temperature
        }
        self.temperature_logs.append(log_entry)
        self.save_records()
        print(f"HACCP: Temperature logged for {area}: {temperature}°C")
    
    def log_cleaning(self, area: str, cleaner: str):
        """Log cleaning activity for HACCP compliance."""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "area": area,
            "cleaner": cleaner
        }
        self.cleaning_logs.append(log_entry)
        self.save_records()
        print(f"HACCP: Cleaning logged for {area} by {cleaner}")
    
    def add_training_record(self, employee: str, topic: str, date: str):
        """Add training record for HACCP compliance."""
        record = {
            "employee": employee,
            "topic": topic,
            "date": date
        }
        self.training_records.append(record)
        self.save_records()
        print(f"HACCP: Training record added for {employee} - {topic}")


class BarLogger:
    """Handles logging for the bar operations."""
    
    def __init__(self, log_file: str = "bar_operations.log"):
        self.log_file = log_file
    
    def log_usage(self, cocktail_name: str, ingredients: Dict[str, int], employee: str = "Unknown"):
        """Log cocktail creation for tracking and analysis."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] COCKTAIL_CREATED: {cocktail_name} | INGREDIENTS: {ingredients} | EMPLOYEE: {employee}\n"
        
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)
        
        print(f"LOGGED: {cocktail_name} created by {employee}")


def mix_cocktail(ingredients: Dict[str, int], cocktail_name: str = "Custom Cocktail",
                 employee: str = "Bartender", inventory: Inventory = None,
                 logger: BarLogger = None) -> bool:
    """
    Mix a cocktail if sufficient ingredients are available.
    
    Args:
        ingredients: Dictionary of required ingredients and their quantities
        cocktail_name: Name of the cocktail being created
        employee: Name of the employee creating the cocktail
        inventory: Inventory instance to check and dispense from
        logger: Logger instance to record the operation
    
    Returns:
        True if cocktail was successfully created, False otherwise
    """
    if inventory is None:
        inventory = Inventory()
    
    if logger is None:
        logger = BarLogger()
    
    if inventory.check(ingredients):
        inventory.dispense(ingredients)
        logger.log_usage(cocktail_name, ingredients, employee)
        print(f"SUCCESS: {cocktail_name} mixed successfully!")
        return True
    else:
        print("Zu wenig Bestände!")
        print("Insufficient inventory to create cocktail!")
        
        # Show which ingredients are insufficient
        for ingredient, required_amount in ingredients.items():
            available = inventory.get_stock_level(ingredient)
            if available < required_amount:
                print(f"  - {ingredient}: need {required_amount}, have {available}")
        return False


def create_sample_cocktails():
    """Return a dictionary of sample cocktails."""
    return {
        "Cosmopolitan": {
            "vodka": 2,
            "lime_juice": 1,
            "triple_sec": 1,
            "simple_syrup": 1,
            "limes": 1
        },
        "Mojito": {
            "rum": 2,
            "limes": 1,
            "mint": 1,
            "simple_syrup": 1,
            "soda_water": 1
        },
        "Martini": {
            "gin": 3,
            "bitters": 1
        },
        "Old Fashioned": {
            "whiskey": 3,
            "bitters": 2,
            "simple_syrup": 1
        },
        "Margarita": {
            "tequila": 2,
            "lime_juice": 1,
            "triple_sec": 1
        }
    }


def main():
    """Main function with command-line interface for the bar inventory system."""
    parser = argparse.ArgumentParser(description="Bar Inventory Management System")
    parser.add_argument("--action", choices=["list", "mix", "add", "haccp", "demo"],
                        help="Action to perform: list inventory, mix cocktail, add stock, HACCP logs, or run demo")
    parser.add_argument("--item", help="Item name for stock operations")
    parser.add_argument("--amount", type=int, help="Amount for stock operations")
    parser.add_argument("--cocktail", help="Cocktail name to mix")
    parser.add_argument("--employee", default="Bartender", help="Employee name")
    
    args = parser.parse_args()
    
    # Initialize systems
    inventory = Inventory()
    logger = BarLogger()
    haccp = HACCPManager()
    
    if args.action == "list":
        inventory.list_inventory()
    elif args.action == "add" and args.item and args.amount:
        inventory.add_stock(args.item, args.amount)
        print(f"Added {args.amount} units of {args.item} to inventory")
    elif args.action == "mix" and args.cocktail:
        cocktails = create_sample_cocktails()
        if args.cocktail in cocktails:
            success = mix_cocktail(
                ingredients=cocktails[args.cocktail],
                cocktail_name=args.cocktail,
                employee=args.employee,
                inventory=inventory,
                logger=logger
            )
        else:
            print(f"Cocktail '{args.cocktail}' not found in recipes")
            print("Available cocktails:", ", ".join(cocktails.keys()))
    elif args.action == "haccp":
        print("HACCP Records:")
        print(f"Temperature logs: {len(haccp.temperature_logs)} entries")
        print(f"Cleaning logs: {len(haccp.cleaning_logs)} entries")
        print(f"Training records: {len(haccp.training_records)} entries")
    elif args.action == "demo":
        print("=== Fluidum UG Bar Inventory Management System ===")
        print("Personalverantwortung für bis zu 8 Mitarbeiter")
        print("Cocktail-Kreation, Logistik, Einkauf, HACCP-Umsetzung")
        print()
        
        # Example usage
        cocktails = create_sample_cocktails()
        print("Available cocktails:")
        for name in cocktails.keys():
            print(f"  - {name}")
        print()
        
        print("Attempting to mix a Cosmopolitan...")
        success = mix_cocktail(
            ingredients=cocktails["Cosmopolitan"],
            cocktail_name="Cosmopolitan",
            employee="Bar-Chef",
            inventory=inventory,
            logger=logger
        )
        print()
        
        # Add some stock
        print("Adding stock...")
        inventory.add_stock("vodka", 5)
        print(f"Current vodka stock: {inventory.get_stock_level('vodka')}")
        print()
        
        # Log some HACCP activities
        print("Logging HACCP compliance activities...")
        haccp.log_temperature("Refrigerator", 4.2)
        haccp.log_cleaning("Bar area", "Bar-Chef")
        haccp.add_training_record("New Employee", "HACCP Basics", "2023-05-15")
        print()
        
        # Show current inventory
        print("Current inventory:")
        inventory.list_inventory()
        print()
        
        print("System ready for bar operations!")
    else:
        # Default behavior - show help
        print("Bar Inventory Management System")
        print("Usage: python bar_inventory.py --action <action> [options]")
        print()
        print("Actions:")
        print("  list  - Show current inventory")
        print("  mix   - Mix a cocktail (requires --cocktail)")
        print("  add   - Add stock (requires --item and --amount)")
        print("  haccp - Show HACCP records")
        print("  demo  - Run system demonstration")
        print()
        print("Examples:")
        print("  python bar_inventory.py --action list")
        print("  python bar_inventory.py --action mix --cocktail Mojito --employee John")
        print("  python bar_inventory.py --action add --item vodka --amount 5")
        print("  python bar_inventory.py --action demo")


if __name__ == "__main__":
    main()