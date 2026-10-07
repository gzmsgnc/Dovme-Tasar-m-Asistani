{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_20
  ];

  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = ["npm" "run" "preview"];
        manager = "web";
        env = {
          PORT = "$PORT";
          NODE_ENV = "production";
        };
      };
    };
  };
}
