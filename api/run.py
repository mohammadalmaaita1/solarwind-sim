#!/usr/bin/env python3
import os
import sys
from app import app

def main():
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))

    print("🚀 Starting SolarWindSim API")
    print(f"📍 Running on http://{host}:{port}")
    print(f"🔧 Debug Mode: {'Enabled' if debug else 'Disabled'}")
    print("=" * 50)

    try:
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n⏹️ Server stopped by user")
    except Exception as e:
        print(f"❌ Server startup error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
