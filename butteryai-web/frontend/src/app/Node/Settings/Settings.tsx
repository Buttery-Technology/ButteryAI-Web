import { ReactComponent as Copy } from "../../../assets/icons/copy.svg";
import { ReactComponent as Edit } from "../../../assets/icons/edit.svg";
import { ReactComponent as Refresh } from "../../../assets/icons/refresh.svg";
import styles from "./Settings.module.scss";

const Settings = () => (
  <section className={styles.root}>
    <strong>API</strong>
    <p>
      Set specific settings for API interactions with this node. API’s that use this node will not have all the features
      supplied by the Hive. Please make sure your authorization tokens and secrets are held securely and private -
      please take this seriously as our system will automatically disable and ban connections that abuse the system
      (learn more). Unusual behavior will be flagged and any activity not screened may be subject to security actions to
      protect the system and Hive. Enterprise versions can disable this feature in the Hive settings.
    </p>
    <div className={styles.keys}>
      <ul>
        <li>
          <strong>URL</strong>
          <p>192.168.X.XXXX</p>
          <div className={styles.icons}>
            <button>
              <Copy />
            </button>
            <button>
              <Edit />
            </button>
          </div>
        </li>
        <li>
          <strong>Secret</strong>
          <p>XXXX-XXXX-XXXX</p>
          <div className={styles.icons}>
            <button>
              <Copy />
            </button>
            <button>
              <Refresh />
            </button>
          </div>
        </li>
        <li>
          <strong>Token</strong>
          <p>192.168.X.XXXX</p>
          <div className={styles.icons}>
            <button>
              <Copy />
            </button>
            <button>
              <Refresh />
            </button>
          </div>
        </li>
      </ul>
      <button>Copy</button>
    </div>
  </section>
);

export default Settings;
