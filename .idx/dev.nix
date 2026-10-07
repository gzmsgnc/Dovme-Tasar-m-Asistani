{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_20
  ];

  idx.previews = {
    enable = true;
    previews = {
      web = {
        // Use the production server for the Firebase Studio preview.
        // This avoids Vite middleware/HMR startup issues while keeping the
        // Express API and authentication endpoints on the same origin.
        command = ["sh" "-lc" "npm run build && NODE_ENV=production PORT=$PORT npm run start"];
        manager = "web";
        env = {
          PORT = "$PORT";
        };
      };
    };
  };
}
