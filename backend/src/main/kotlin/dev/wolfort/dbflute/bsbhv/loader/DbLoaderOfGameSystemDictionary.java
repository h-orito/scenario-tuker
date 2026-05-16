package dev.wolfort.dbflute.bsbhv.loader;

import java.util.List;

import org.dbflute.bhv.*;
import dev.wolfort.dbflute.exbhv.*;
import dev.wolfort.dbflute.exentity.*;

/**
 * The referrer loader of GAME_SYSTEM_DICTIONARY as TABLE.
 * @author DBFlute(AutoGenerator)
 */
public class DbLoaderOfGameSystemDictionary {

    // ===================================================================================
    //                                                                           Attribute
    //                                                                           =========
    protected List<DbGameSystemDictionary> _selectedList;
    protected BehaviorSelector _selector;
    protected DbGameSystemDictionaryBhv _myBhv; // lazy-loaded

    // ===================================================================================
    //                                                                   Ready for Loading
    //                                                                   =================
    public DbLoaderOfGameSystemDictionary ready(List<DbGameSystemDictionary> selectedList, BehaviorSelector selector)
    { _selectedList = selectedList; _selector = selector; return this; }

    protected DbGameSystemDictionaryBhv myBhv()
    { if (_myBhv != null) { return _myBhv; } else { _myBhv = _selector.select(DbGameSystemDictionaryBhv.class); return _myBhv; } }

    // ===================================================================================
    //                                                                    Pull out Foreign
    //                                                                    ================
    protected DbLoaderOfGameSystem _foreignGameSystemLoader;
    public DbLoaderOfGameSystem pulloutGameSystem() {
        if (_foreignGameSystemLoader == null)
        { _foreignGameSystemLoader = new DbLoaderOfGameSystem().ready(myBhv().pulloutGameSystem(_selectedList), _selector); }
        return _foreignGameSystemLoader;
    }

    // ===================================================================================
    //                                                                            Accessor
    //                                                                            ========
    public List<DbGameSystemDictionary> getSelectedList() { return _selectedList; }
    public BehaviorSelector getSelector() { return _selector; }
}
